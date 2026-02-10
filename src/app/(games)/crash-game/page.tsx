'use client';

import { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import { useCrashStore } from '@/stores/useCrashStore';
import { crashService } from '@/services/CrashService.class';
import { io, type Socket } from 'socket.io-client';
import type {
  GameTickPayload,
  GameCrashPayload,
  GameWaitingPayload,
  GameStartPayload,
  BetPlacedPayload,
  BetCashoutPayload,
  PlayerBet,
} from '@/types/crash';
import GameConfigPanel from '@/shared/GameConfigPanel/GameConfigPanel';
import { GameType } from '@/components/Dashboard/GameSelector/constants';
import { USER_QUERY_KEY } from '@/hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { formatNumber } from '@/utils/format';
import { useCrashHistory } from '@/hooks/useHistoryTable';
import { HISTORY_CONFIG } from '@/shared/History/constants';
import { GameDisplay, GlobalGameHistory } from '@/components/CrashGame';
import {
  ROCKET_POSITION,
  ANIMATION_DURATION,
  SHAKE_THRESHOLDS,
  WEBSOCKET_CONFIG,
  GAME_CONSTANTS,
} from '@/components/CrashGame/constants';
import { GAME_STATES } from '@/components/CrashGame/GameDisplay';
import { useTranslation } from '@/i18n/useTranslation';

export default function CrashGamePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const subscribedGameIdRef = useRef<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Animation state
  const [rocketPosition, setRocketPosition] = useState(ROCKET_POSITION.START);
  const [isRocketCrashed, setIsRocketCrashed] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState<
    'light' | 'medium' | 'heavy'
  >('light');
  const [animationPhase, setAnimationPhase] = useState<
    'idle' | 'launching' | 'flying' | 'crashed' | 'respawning'
  >('idle');

  // Track previous shake intensity to avoid unnecessary updates
  const prevShakeIntensityRef = useRef<'light' | 'medium' | 'heavy'>('light');

  // Track if user just cashed out to prevent showing lose modal on crash
  const justCashedOutRef = useRef(false);
  // Preload explosion GIF
  useEffect(() => {
    const img = new window.Image();
    img.src = '/crash-game/rocket-boom/rocket-boom1.gif';
  }, []);

  // Fetch all games history for display
  const { data: allGamesData, refetch: refetchAllGames } = useCrashHistory(
    'allGames',
    { limit: HISTORY_CONFIG.LIMIT }
  );

  // Use ref for handleCashout to call from socket handlers
  const handleCashoutRef = useRef<() => void>(() => {});
  // Use ref for handleRefreshHistory to call from socket handlers
  const handleRefreshHistoryRef = useRef<() => void>(() => {});

  const {
    gameState,
    multiplier,
    myBet,
    betAmount,
    autoCashout,
    isAutoCashoutEnabled,
    isPlacingBet,
    isCashingOut,
    setMyBet,
    setBetAmount,
    setAutoCashout,
    setIsAutoCashoutEnabled,
    updatePlayerCashout,
    setIsPlacingBet,
    setIsCashingOut,
    showWinModalWithData,
    hideModals,
  } = useCrashStore();

  // Refresh all history (all games + user bets)
  const handleRefreshHistory = useCallback(async () => {
    await refetchAllGames();
    await queryClient.invalidateQueries({ queryKey: ['history', 'crash'] });
  }, [refetchAllGames, queryClient]);

  const handlePlaceBet = useCallback(async () => {
    // Read fresh state from store to avoid stale closure issues
    const state = useCrashStore.getState();
    if (
      state.gameState !== GAME_STATES.WAITING ||
      state.isPlacingBet ||
      state.myBet
    ) {
      return;
    }

    const { betAmount, isAutoCashoutEnabled, autoCashout } = state;

    setIsPlacingBet(true);
    try {
      // Only send bet amount to server, autocashout is client-side only
      const response = await crashService.placeBet({
        amount: betAmount,
      });

      // Update game ID and re-subscribe (like working vanilla JS code)
      const store = useCrashStore.getState();
      store.setGameId(response.gameId);
      subscribedGameIdRef.current = response.gameId;

      if (socketRef.current?.connected) {
        socketRef.current.emit('subscribe:game', { gameId: response.gameId });
      }

      // Store bet with client-side autocashout value
      setMyBet({
        betId: response.betId,
        amount: response.amount,
        autoCashout: isAutoCashoutEnabled
          ? (autoCashout ?? undefined)
          : undefined,
      });
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    } catch (error) {
      console.error('Failed to place bet:', error);
    } finally {
      setIsPlacingBet(false);
    }
  }, [setIsPlacingBet, setMyBet, queryClient]);

  const handleCashout = useCallback(async () => {
    const state = useCrashStore.getState();
    if (
      state.gameState !== GAME_STATES.RUNNING ||
      !state.myBet ||
      state.isCashingOut
    ) {
      return;
    }

    // Mark that user clicked cashout to prevent lose modal
    justCashedOutRef.current = true;

    setIsCashingOut(true);
    try {
      const result = await crashService.cashout({ betId: state.myBet.betId });

      // Show win modal
      showWinModalWithData(
        result.winAmount,
        result.multiplier,
        state.myBet.amount
      );
      setTimeout(() => hideModals(), 2000);

      updatePlayerCashout(
        state.myBet.betId,
        result.multiplier,
        result.winAmount
      );
      setMyBet(null);
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    } catch (error) {
      // If bet not found (404), server already cashed out - clear myBet to stop retries
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        setMyBet(null);
        void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      } else {
        console.error('Failed to cashout:', error);
        // Reset flag if cashout failed
        justCashedOutRef.current = false;
      }
    } finally {
      setIsCashingOut(false);
    }
  }, [
    setIsCashingOut,
    setMyBet,
    updatePlayerCashout,
    queryClient,
    showWinModalWithData,
    hideModals,
  ]);

  // Keep ref updated with latest handleCashout
  handleCashoutRef.current = handleCashout;

  // Keep ref updated with latest handleRefreshHistory
  handleRefreshHistoryRef.current = () => {
    void handleRefreshHistory();
  };

  // Animation Effect 0: Reset on waiting state (new game)
  useEffect(() => {
    if (gameState === GAME_STATES.WAITING) {
      setAnimationPhase('idle');
      setIsRocketCrashed(false);
      setRocketPosition({ ...ROCKET_POSITION.START });
      setShakeIntensity('light');
      prevShakeIntensityRef.current = 'light';
    }
  }, [gameState]);

  // Animation Effect 1: Launch Animation
  useEffect(() => {
    if (gameState === GAME_STATES.RUNNING && animationPhase === 'idle') {
      setAnimationPhase('launching');
    }
  }, [gameState, animationPhase]);

  useEffect(() => {
    if (animationPhase === 'launching') {
      // Delay position change to next frame so transition class is applied first
      requestAnimationFrame(() => {
        setRocketPosition({ ...ROCKET_POSITION.CENTER });
      });
      const timer = setTimeout(() => {
        setAnimationPhase('flying');
      }, ANIMATION_DURATION.LAUNCH);
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  // Animation Effect 2: Crash Animation
  // Sync with lose modal - only show boom if lose modal is shown
  useEffect(() => {
    if (
      gameState === GAME_STATES.CRASHED &&
      animationPhase !== 'crashed' &&
      animationPhase !== 'respawning'
    ) {
      const state = useCrashStore.getState();
      // Only show crash animation if user had a bet AND didn't cash out (same logic as lose modal)
      if (state.showLoseModal) {
        setAnimationPhase('crashed');
        setIsRocketCrashed(true);
        const timer = setTimeout(() => {
          setAnimationPhase('respawning');
        }, ANIMATION_DURATION.CRASH_EXPLOSION);
        return () => clearTimeout(timer);
      } else {
        // If no lose modal (user cashed out or no bet), skip crash animation and go straight to respawn
        setAnimationPhase('respawning');
      }
    }
  }, [gameState, animationPhase]);

  // Animation Effect 3: Respawn Animation
  useEffect(() => {
    if (animationPhase === 'respawning') {
      setIsRocketCrashed(false);
      setRocketPosition({ ...ROCKET_POSITION.START });
      const timer = setTimeout(() => {
        setAnimationPhase('idle');
      }, ANIMATION_DURATION.RESPAWN);
      return () => clearTimeout(timer);
    }
  }, [animationPhase]);

  // Animation Effect 4: Shake Intensity Calculator (optimized to only update on threshold changes)
  useEffect(() => {
    if (animationPhase === 'flying') {
      let newIntensity: 'light' | 'medium' | 'heavy';
      if (multiplier >= SHAKE_THRESHOLDS.HEAVY) {
        newIntensity = 'heavy';
      } else if (multiplier >= SHAKE_THRESHOLDS.MEDIUM) {
        newIntensity = 'medium';
      } else {
        newIntensity = 'light';
      }

      // Only update state if intensity actually changed
      if (newIntensity !== prevShakeIntensityRef.current) {
        prevShakeIntensityRef.current = newIntensity;
        setShakeIntensity(newIntensity);
      }
    }
  }, [multiplier, animationPhase]);

  // WebSocket connection - direct connection to namespace
  useEffect(() => {
    // Get base URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const baseUrl = apiUrl.replace(/\/api$/, '');
    const socketUrl = `${baseUrl}/crash`;

    // Create socket with direct connection
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: WEBSOCKET_CONFIG.RECONNECTION_ATTEMPTS,
      reconnectionDelay: WEBSOCKET_CONFIG.RECONNECTION_DELAY,
      timeout: WEBSOCKET_CONFIG.TIMEOUT,
      forceNew: true,
    });

    socketRef.current = socket;

    // Function to fetch current game and subscribe
    const fetchAndSubscribe = async () => {
      try {
        const game = await crashService.getCurrentGame();
        const store = useCrashStore.getState();

        subscribedGameIdRef.current = game.gameId;

        store.setGameId(game.gameId);
        store.setGameState(game.state);
        store.setServerSeedHash(game.serverSeedHash);

        // Only set multiplier if game is running, otherwise keep it at 1.0
        if (
          game.multiplier !== undefined &&
          game.state === GAME_STATES.RUNNING
        ) {
          store.setMultiplier(game.multiplier);
        }
        if (game.myBet) {
          store.setMyBet(game.myBet);
        }

        socket.emit('subscribe:game', { gameId: game.gameId });
      } catch (err) {
        console.error('Failed to fetch and subscribe:', err);
      }
    };

    socket.on('connect', () => {
      setIsConnected(true);
      // Fetch current game and subscribe
      void fetchAndSubscribe();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('game:waiting', (data: GameWaitingPayload) => {
      const s = useCrashStore.getState();
      s.resetRound();
      s.setGameId(data.gameId);
      s.setServerSeedHash(data.serverSeedHash);
      s.setStartsAt(data.startsAt);
      s.setGameState(GAME_STATES.WAITING);
      s.clearMultiplierHistory();
      subscribedGameIdRef.current = data.gameId;
      socket.emit('subscribe:game', { gameId: data.gameId });
    });

    socket.on('game:start', (data: GameStartPayload) => {
      const s = useCrashStore.getState();
      if (data.gameId) {
        s.setGameId(data.gameId);
      }
      s.setGameState(GAME_STATES.RUNNING);
      s.setMultiplier(GAME_CONSTANTS.INITIAL_MULTIPLIER);
      s.setStartsAt(null);
      s.setGameStartTime(Date.now());
    });

    socket.on('game:tick', (data: GameTickPayload) => {
      const store = useCrashStore.getState();
      // Ensure gameState is 'running' when receiving ticks (like vanilla JS)
      if (store.gameState !== GAME_STATES.RUNNING) {
        store.setGameState(GAME_STATES.RUNNING);
      }
      store.setMultiplier(data.multiplier);

      // Add multiplier data point for chart
      if (store.gameStartTime !== null) {
        const elapsedTime = Date.now() - store.gameStartTime;
        store.addMultiplierDataPoint({
          time: elapsedTime,
          multiplier: data.multiplier,
        });
      }

      // Client-side auto-cashout - simulate clicking the Cashout button
      const { myBet, isCashingOut } = store;
      if (
        myBet?.autoCashout &&
        data.multiplier >= myBet.autoCashout &&
        !isCashingOut
      ) {
        handleCashoutRef.current();
      }
    });

    socket.on('game:crash', (data: GameCrashPayload) => {
      const s = useCrashStore.getState();

      // Only show lose modal if user had a bet AND didn't just cash out
      if (s.myBet && !justCashedOutRef.current) {
        s.showLoseModalWithData(s.myBet.amount, data.crashPoint);
        setTimeout(() => s.hideModals(), 2000);
      }

      // Reset the cashout flag for next round
      justCashedOutRef.current = false;

      s.setGameState(GAME_STATES.CRASHED);
      s.setCrashPoint(data.crashPoint);
      s.setMultiplier(1.0);
      s.setServerSeed(data.serverSeed);
      s.setMyBet(null);

      // Refresh both global history and user's bet history
      handleRefreshHistoryRef.current();

      // After crash, fetch new game and subscribe
      setTimeout(() => {
        void fetchAndSubscribe();
      }, ANIMATION_DURATION.POST_CRASH_FETCH_DELAY);
    });

    socket.on('bet:placed', (data: BetPlacedPayload) => {
      const playerBet: PlayerBet = {
        betId: data.betId,
        odg: data.odg || 0,
        odh: data.odh || '',
        userId: data.userId,
        username: data.username,
        amount: data.amount,
        autoCashout: data.autoCashout,
        cashedOut: false,
      };
      useCrashStore.getState().addPlayer(playerBet);
    });

    socket.on('bet:cashout', (data: BetCashoutPayload) => {
      const store = useCrashStore.getState();
      // Update player list to show cashout (for all players including us)
      store.updatePlayerCashout(data.betId, data.multiplier, data.winAmount);
    });

    socket.on('game:players', (data: PlayerBet[]) => {
      useCrashStore.getState().setPlayers(data);
    });

    socket.on('connect_error', (error: Error) => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('error', (error: unknown) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [queryClient]);

  const canPlaceBet =
    gameState === GAME_STATES.WAITING && !myBet && !isPlacingBet && isConnected;
  const canCashout =
    gameState === GAME_STATES.RUNNING && myBet && !isCashingOut;

  // Memoize calculated values to prevent unnecessary rerenders
  const potentialWin = useMemo(
    () => (myBet ? myBet.amount * multiplier : betAmount * multiplier),
    [myBet, multiplier, betAmount]
  );

  // GameConfigPanel vars - show Cashout when game running OR multiplier growing
  const isGameActive = useMemo(
    () =>
      !!myBet &&
      (gameState === GAME_STATES.RUNNING ||
        multiplier > GAME_CONSTANTS.MULTIPLIER_ACTIVE_THRESHOLD),
    [myBet, gameState, multiplier]
  );

  const autoCashoutValue = useMemo(
    () => autoCashout?.toString() ?? '',
    [autoCashout]
  );

  const primaryLabel = useMemo(
    () =>
      isPlacingBet
        ? t.configPanel.placing
        : myBet
          ? t.configPanel.betPlaced
          : t.configPanel.placeBetButton,
    [isPlacingBet, myBet, t]
  );

  const secondaryLabel = useMemo(
    () =>
      isCashingOut
        ? t.configPanel.cashingOut
        : `${t.configPanel.cashoutButton} $${potentialWin.toFixed(2)}`,
    [isCashingOut, potentialWin, t]
  );

  const isButtonDisabled = useMemo(
    () => (isGameActive ? !canCashout : !canPlaceBet),
    [isGameActive, canCashout, canPlaceBet]
  );

  // Memoize callbacks for GameConfigPanel
  const handleOptionChange = useCallback(
    (_name: string, value: string) => {
      setAutoCashout(value ? Number(value) : null);
    },
    [setAutoCashout]
  );

  const handleOptionToggleChange = useCallback(
    (_name: string, enabled: boolean) => {
      setIsAutoCashoutEnabled(enabled);
    },
    [setIsAutoCashoutEnabled]
  );

  // Memoize object props for GameConfigPanel
  const optionValues = useMemo(
    () => ({ [t.configPanel.autoCashout]: autoCashoutValue }),
    [autoCashoutValue, t]
  );

  const optionToggles = useMemo(
    () => ({ [t.configPanel.autoCashout]: isAutoCashoutEnabled }),
    [isAutoCashoutEnabled, t]
  );

  const primaryButton = useMemo(
    () => ({ label: primaryLabel, onClick: handlePlaceBet }),
    [primaryLabel, handlePlaceBet]
  );

  const secondaryButton = useMemo(
    () => ({ label: secondaryLabel, onClick: handleCashout }),
    [secondaryLabel, handleCashout]
  );

  const infoValues = useMemo(
    () => ({
      [t.configPanel.currentMultiplier]: `${formatNumber(multiplier)}x`,
      [t.configPanel.potentialWin]: `$${formatNumber(potentialWin)}`,
    }),
    [multiplier, potentialWin, t]
  );

  // Memoize games array to prevent GlobalGameHistory re-renders
  const globalGames = useMemo(
    () => (allGamesData && 'games' in allGamesData ? allGamesData.games : []),
    [allGamesData]
  );

  return (
    <div className="flex flex-col gap-4 pt-4">
      {/* Top: Game Window + Config Panel */}
      <div className="flex gap-4">
        {/* Left Column: Multiplier Display + Last Games */}
        <div className="flex w-full gap-3 px-6 max-lg:flex-col max-lg:items-center">
          {/* Game Display */}
          <GameDisplay
            rocketPosition={rocketPosition}
            animationPhase={animationPhase}
            shakeIntensity={shakeIntensity}
            isRocketCrashed={isRocketCrashed}
          />
          {/* Bet Controls */}
          <div className="flex w-full max-w-[28rem] flex-col gap-3">
            <GameConfigPanel
              game={GameType.CRASH}
              betAmount={betAmount}
              onBetChange={setBetAmount}
              isGameActive={isGameActive}
              optionValues={optionValues}
              onOptionChange={handleOptionChange}
              optionToggles={optionToggles}
              onOptionToggleChange={handleOptionToggleChange}
              primaryButton={primaryButton}
              secondaryButton={secondaryButton}
              buttonDisabled={isButtonDisabled}
              infoValues={infoValues}
            />
            <GlobalGameHistory
              games={globalGames}
              onRefresh={handleRefreshHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
