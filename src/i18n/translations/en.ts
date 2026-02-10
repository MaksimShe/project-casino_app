export const en = {
  leaderboard: {
    title: 'Leaderboard',
    topPlayers: 'Top players',
    loading: 'Loading...',
    error: 'Failed to load leaderboard',
    noPlayers: 'No players yet',
    gamesItem: 'Games',
    winRate: 'Wins',
  },
  games: {
    crash: {
      name: 'Crash',
      description: "Watch the multiplier rise and cash out before it's gone",
    },
    case: {
      name: 'Case',
      description: 'Open cases and win random rewards',
    },
    mines: {
      name: 'Mines',
      description: 'Avoid the mines and collect bigger rewards',
    },
    plinko: {
      name: 'Plinko',
      description: 'Drop the ball, watch it bounce, and win prizes',
    },
    startGame: 'Free play',
  },
  badges: {
    new: 'New',
    hot: 'Hot',
    popular: 'Popular',
  },
  chat: {
    title: 'Live Chat',
    online: 'Online',
    users: 'Users',
    messagePlaceholder: 'Write a message...',
  },
  header: {
    returnToHomepage: 'All Games',
    logout: 'Log Out',
  },
  history: {
    title: 'Game History',
    crashGlobalHistory: 'Last global {{count}} Games',
    failedLoad: 'Failed to load history:',
  },
  configPanel: {
    crash: 'Crash',
    plinko: 'Plinko',
    mines: 'Mines',
    titleEnd: 'Configuration',
    betInput: 'Bet Amount',
    autoCashout: 'Auto Cashout (optional)',
    placeBetButton: 'Place Bet',
    cashoutButton: 'Cashout',
    dropButton: 'Drop',
    minesAmount: 'Mines Amount',
    gridSize: 'Grid size:',
    risk: 'Risk',
    rows: 'Rows',
    currentMultiplier: 'Current multiplayer:',
    potentialWin: 'Potential win:',
    winAmount: 'Win amount:',
    nextMultiplier: 'Next multiplier:',
    riskLow: 'Low',
    riskMedium: 'Medium',
    riskHigh: 'High',
    placing: 'Placing...',
    betPlaced: 'Bet Placed',
    cashingOut: 'Cashing out...',
  },
};

export type TranslationKeys = {
  leaderboard: {
    title: string;
    topPlayers: string;
    loading: string;
    error: string;
    noPlayers: string;
    gamesItem: string;
    winRate: string;
  };
  games: {
    crash: {
      name: string;
      description: string;
    };
    case: {
      name: string;
      description: string;
    };
    mines: {
      name: string;
      description: string;
    };
    plinko: {
      name: string;
      description: string;
    };
    startGame: string;
  };
  badges: {
    new: string;
    hot: string;
    popular: string;
  };
  chat: {
    title?: string;
    openChat?: string;
    online: string;
    users: string;
    messagePlaceholder: string;
  };
  header: {
    returnToHomepage: string;
    logout: string;
  };
  history: {
    title: string;
    crashGlobalHistoryStart: string;
    failedLoad: string;
  };
  configPanel: {
    crash: string;
    plinko: string;
    mines: string;
    titleEnd: string;
    betInput: string;
    autoCashout: string;
    placeBetButton: string;
    cashoutButton: string;
    dropButton: string;
    minesAmount: string;
    gridSize: string;
    risk: string;
    rows: string;
    currentMultiplier: string;
    potentialWin: string;
    winAmount: string;
    nextMultiplier: string;
    riskLow: string;
    riskMedium: string;
    riskHigh: string;
    placing: string;
    betPlaced: string;
    cashingOut: string;
  };
};
