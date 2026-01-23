'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
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

export default function CrashGamePage() {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);
  const subscribedGameIdRef = useRef<string | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Fetch all games history for display
  const { data: allGamesData, refetch: refetchAllGames } = useCrashHistory(
    'allGames',
    { limit: 10 }
  );

  // Use ref for addLog to avoid closure issues
  const addLogRef = useRef<(message: string) => void>(() => {});
  addLogRef.current = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 49)]);
    console.log(`[Crash Debug] ${message}`);
  };

  const addLog = useCallback((message: string) => {
    addLogRef.current(message);
  }, []);

  // Use ref for handleCashout to call from socket handlers
  const handleCashoutRef = useRef<() => void>(() => {});

  const {
    gameId,
    gameState,
    multiplier,
    crashPoint,
    startsAt,
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
  } = useCrashStore();

  // Countdown timer effect
  useEffect(() => {
    if (gameState !== 'waiting' || !startsAt) {
      setCountdown(0);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((startsAt - now) / 1000));
      setCountdown(remaining);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 100);

    return () => clearInterval(interval);
  }, [gameState, startsAt]);

  const handlePlaceBet = useCallback(async () => {
    // Read fresh state from store to avoid stale closure issues
    const state = useCrashStore.getState();
    if (state.gameState !== 'waiting' || state.isPlacingBet || state.myBet) {
      return;
    }

    const { betAmount, isAutoCashoutEnabled, autoCashout } = state;

    setIsPlacingBet(true);
    try {
      const response = await crashService.placeBet({
        amount: betAmount,
        autoCashout: isAutoCashoutEnabled
          ? (autoCashout ?? undefined)
          : undefined,
      });

      // Update game ID and re-subscribe (like working vanilla JS code)
      const store = useCrashStore.getState();
      store.setGameId(response.gameId);
      subscribedGameIdRef.current = response.gameId;

      if (socketRef.current?.connected) {
        socketRef.current.emit('subscribe:game', { gameId: response.gameId });
        addLog(`Re-subscribed to game: ${response.gameId}`);
      }

      setMyBet({
        betId: response.betId,
        amount: response.amount,
        autoCashout: isAutoCashoutEnabled
          ? (autoCashout ?? undefined)
          : undefined,
      });
      addLog(
        `Bet placed: ${response.betId}${isAutoCashoutEnabled && autoCashout ? ` (auto-cashout at ${autoCashout}x)` : ''}`
      );
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    } catch (error) {
      addLog(`Bet error: ${error}`);
      console.error('Failed to place bet:', error);
    } finally {
      setIsPlacingBet(false);
    }
  }, [setIsPlacingBet, setMyBet, addLog, queryClient]);

  const handleCashout = useCallback(async () => {
    const state = useCrashStore.getState();
    if (state.gameState !== 'running' || !state.myBet || state.isCashingOut) {
      return;
    }

    setIsCashingOut(true);
    try {
      const result = await crashService.cashout({ betId: state.myBet.betId });

      updatePlayerCashout(
        state.myBet.betId,
        result.multiplier,
        result.winAmount
      );
      setMyBet(null);
      addLog(`Cashout: ${result.multiplier}x, won $${result.winAmount}`);
      void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    } catch (error) {
      // If bet not found (404), server already cashed out - clear myBet to stop retries
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        addLog(`Auto-cashout handled by server`);
        setMyBet(null);
        void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      } else {
        addLog(`Cashout error: ${error}`);
        console.error('Failed to cashout:', error);
      }
    } finally {
      setIsCashingOut(false);
    }
  }, [setIsCashingOut, setMyBet, updatePlayerCashout, addLog, queryClient]);

  // Keep ref updated with latest handleCashout
  handleCashoutRef.current = handleCashout;

  // WebSocket connection - direct connection to namespace
  useEffect(() => {
    addLog('Connecting to crash namespace...');

    // Get base URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const baseUrl = apiUrl.replace(/\/api$/, '');
    const socketUrl = `${baseUrl}/crash`;

    addLog(`Socket URL: ${socketUrl}`);

    // Create socket with direct connection
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true,
    });

    socketRef.current = socket;

    // Function to fetch current game and subscribe
    const fetchAndSubscribe = async () => {
      try {
        const game = await crashService.getCurrentGame();
        const store = useCrashStore.getState();

        addLog(`Current game: ${game.gameId}, state: ${game.state}`);
        subscribedGameIdRef.current = game.gameId;

        store.setGameId(game.gameId);
        store.setGameState(game.state);
        store.setServerSeedHash(game.serverSeedHash);

        if (game.multiplier !== undefined) {
          store.setMultiplier(game.multiplier);
        }
        if (game.myBet) {
          store.setMyBet(game.myBet);
        }

        addLog(`Subscribing to game: ${game.gameId}`);
        socket.emit('subscribe:game', { gameId: game.gameId });
      } catch (err) {
        addLog(`Error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }
    };

    // Log ALL events for debugging
    socket.onAny((eventName: string, ...args: unknown[]) => {
      addLog(`Event: ${eventName} - ${JSON.stringify(args).slice(0, 150)}`);
    });

    socket.on('connect', () => {
      addLog(`Connected! Socket ID: ${socket.id}`);
      setIsConnected(true);

      // Fetch current game and subscribe
      void fetchAndSubscribe();
    });

    socket.on('disconnect', reason => {
      addLog(`Disconnected: ${reason}`);
      setIsConnected(false);
    });

    socket.on('game:waiting', (data: GameWaitingPayload) => {
      addLog(`game:waiting - gameId: ${data.gameId}`);
      const s = useCrashStore.getState();
      s.resetRound();
      s.setGameId(data.gameId);
      s.setServerSeedHash(data.serverSeedHash);
      s.setStartsAt(data.startsAt);
      s.setGameState('waiting');
      subscribedGameIdRef.current = data.gameId;
      socket.emit('subscribe:game', { gameId: data.gameId });
    });

    socket.on('game:start', (data: GameStartPayload) => {
      addLog(`game:start - gameId: ${data.gameId}`);
      const s = useCrashStore.getState();
      if (data.gameId) {
        s.setGameId(data.gameId);
      }
      s.setGameState('running');
      s.setMultiplier(1.0);
      s.setStartsAt(null);
    });

    socket.on('game:tick', (data: GameTickPayload) => {
      const store = useCrashStore.getState();
      // Ensure gameState is 'running' when receiving ticks (like vanilla JS)
      if (store.gameState !== 'running') {
        store.setGameState('running');
      }
      store.setMultiplier(data.multiplier);

      // Client-side auto-cashout - simulate clicking the Cashout button
      const { myBet, isCashingOut } = store;
      if (
        myBet?.autoCashout &&
        data.multiplier >= myBet.autoCashout &&
        !isCashingOut
      ) {
        addLog(
          `Auto-cashout at ${data.multiplier}x (target: ${myBet.autoCashout}x)`
        );
        handleCashoutRef.current();
      }
    });

    socket.on('game:crash', (data: GameCrashPayload) => {
      addLog(`game:crash - crashPoint: ${data.crashPoint}`);
      const s = useCrashStore.getState();
      s.setGameState('crashed');
      s.setCrashPoint(data.crashPoint);
      s.setMultiplier(data.crashPoint);
      s.setServerSeed(data.serverSeed);
      s.setMyBet(null);

      // After crash, fetch new game and subscribe
      setTimeout(() => {
        void fetchAndSubscribe();
      }, 1500);
    });

    socket.on('bet:placed', (data: BetPlacedPayload) => {
      addLog(`bet:placed - ${data.username}: $${data.amount}`);
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
      addLog(
        `bet:cashout - ${data.username}: ${data.multiplier}x, won $${data.winAmount}`
      );
      const store = useCrashStore.getState();
      store.updatePlayerCashout(data.betId, data.multiplier, data.winAmount);

      // Check if this is OUR bet being cashed out (server-side auto-cashout)
      if (store.myBet?.betId === data.betId) {
        addLog(
          `Your auto-cashout: ${data.multiplier}x, won $${data.winAmount}`
        );
        store.setMyBet(null);
        store.setIsCashingOut(false);
        void queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      }
    });

    socket.on('game:players', (data: PlayerBet[]) => {
      addLog(`game:players - count: ${data.length}`);
      useCrashStore.getState().setPlayers(data);
    });

    socket.on('connect_error', (error: Error) => {
      addLog(`Connect error: ${error.message}`);
    });

    socket.on('error', (error: unknown) => {
      addLog(`Socket error: ${JSON.stringify(error)}`);
    });

    return () => {
      addLog('Cleanup: disconnecting...');
      socket.offAny();
      socket.removeAllListeners();
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMultiplierColor = () => {
    if (gameState === 'crashed') return 'text-red-500';
    if (multiplier >= 10) return 'text-purple-400';
    if (multiplier >= 5) return 'text-yellow-400';
    if (multiplier >= 2) return 'text-green-400';
    return 'text-white';
  };

  const getStatusText = () => {
    if (!isConnected) {
      return 'Connecting...';
    }
    if (gameState === 'waiting') {
      return countdown > 0
        ? `Starting in ${countdown}s`
        : 'Waiting for bets...';
    }
    if (gameState === 'crashed') {
      return 'Crashed!';
    }
    return '';
  };

  const canPlaceBet =
    gameState === 'waiting' && !myBet && !isPlacingBet && isConnected;
  const canCashout = gameState === 'running' && myBet && !isCashingOut;
  const potentialWin = myBet
    ? myBet.amount * multiplier
    : betAmount * multiplier;

  // GameConfigPanel vars - show Cashout when game running OR multiplier growing
  const isGameActive = !!myBet && (gameState === 'running' || multiplier > 1.0);
  const autoCashoutValue = autoCashout?.toString() ?? '';
  const primaryLabel = isPlacingBet
    ? 'Placing...'
    : myBet
      ? 'Bet Placed'
      : 'Place Bet';
  const secondaryLabel = isCashingOut
    ? 'Cashing out...'
    : `Cashout $${potentialWin.toFixed(2)}`;
  const isButtonDisabled = isGameActive ? !canCashout : !canPlaceBet;

  // Refresh all history (all games + user bets)
  const handleRefreshHistory = useCallback(async () => {
    await refetchAllGames();
    await queryClient.invalidateQueries({ queryKey: ['history', 'crash'] });
  }, [refetchAllGames, queryClient]);

  return (
    <div className="flex min-h-screen flex-col gap-4 p-4">
      {/* Top: Game Window + Config Panel */}
      <div className="flex gap-4">
        {/* Left Column: Multiplier Display + Last Games */}
        <div className="flex flex-col gap-3">
          {/* Multiplier Display */}
          <div className="relative flex h-[400px] w-[500px] flex-col items-center justify-center rounded-xl bg-[#1a1625] lg:h-[500px]">
            {/* Background Grid */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <svg className="h-full w-full opacity-20">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#4a4560"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Connection Status */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              <span
                className={`inline-block h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              />
            </div>

            {/* Status Text */}
            <div className="absolute top-4 text-center">
              <span className="text-lg text-gray-400">{getStatusText()}</span>
            </div>
            {/* Main Multiplier */}
            <div className="z-10 flex flex-col items-center">
              <span
                className={`text-7xl font-bold transition-colors lg:text-9xl ${getMultiplierColor()}`}
              >
                {multiplier}x
              </span>
              {gameState === 'crashed' && crashPoint && (
                <span className="mt-2 text-xl text-red-400">
                  Crashed at {crashPoint}x
                </span>
              )}
            </div>
            {/* Game ID & State */}
            <div className="absolute bottom-4 text-center text-xs text-gray-500">
              {gameId && <div>Game #{gameId.slice(-8)}</div>}
              <div>State: {gameState}</div>
            </div>
          </div>

          {/* Last 10 Games Crash Points */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Last 10 Games</span>
              <button
                onClick={handleRefreshHistory}
                className="rounded bg-purple-600 px-3 py-1 text-xs text-white transition-colors hover:bg-purple-700"
              >
                Refresh History
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              {allGamesData &&
                'games' in allGamesData &&
                allGamesData.games.slice(0, 10).map((game, index) => {
                  const crashPoint = game.crashPoint;
                  let colorClass: string;
                  if (crashPoint < 2) {
                    colorClass = 'bg-gray-900/50 text-gray-300';
                  } else if (crashPoint < 10) {
                    colorClass = 'bg-yellow-900/50 text-yellow-300';
                  } else if (crashPoint < 100) {
                    colorClass = 'bg-blue-900/50 text-blue-300';
                  } else {
                    colorClass = 'bg-purple-900/50 text-purple-300';
                  }
                  return (
                    <span
                      key={index}
                      className={`rounded px-2 py-1 text-xs font-semibold ${colorClass}`}
                    >
                      {crashPoint.toFixed(2)}x
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Bet Controls */}
        <GameConfigPanel
          game={GameType.CRASH}
          betAmount={betAmount}
          onBetChange={setBetAmount}
          isGameActive={isGameActive}
          optionValues={{ 'Auto Cashout (optional)': autoCashoutValue }}
          onOptionChange={(_name, value) =>
            setAutoCashout(value ? Number(value) : null)
          }
          optionToggles={{ 'Auto Cashout (optional)': isAutoCashoutEnabled }}
          onOptionToggleChange={(_name, enabled) =>
            setIsAutoCashoutEnabled(enabled)
          }
          primaryButton={{ label: primaryLabel, onClick: handlePlaceBet }}
          secondaryButton={{ label: secondaryLabel, onClick: handleCashout }}
          buttonDisabled={isButtonDisabled}
          infoValues={{
            'Current multiplayer:': `${formatNumber(2)}x`,
            'Potential win:': `$${formatNumber(2)}`,
          }}
        />
      </div>
      {/* Bottom: Debug Logs */}
      <div className="rounded-xl bg-[#1a1625] p-4">
        <h3 className="mb-2 text-sm font-semibold text-white">
          Debug Logs (WebSocket Events)
        </h3>
        <div className="max-h-[200px] overflow-y-auto font-mono text-xs">
          {debugLogs.length === 0 ? (
            <p className="text-gray-500">No events yet...</p>
          ) : (
            debugLogs.map((log, i) => (
              <div key={i} className="text-gray-400">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
