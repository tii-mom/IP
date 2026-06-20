import { CreditState, CreditTransaction } from '../types/audit';

const LOCAL_STORAGE_KEY = 'pilot_credits_state';

function generateRandomInviteCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function loadCreditState(): CreditState {
  const defaultState: CreditState = {
    balance: 10,
    date: new Date().toLocaleDateString(),
    completedTasks: {},
    inviteCode: generateRandomInviteCode(),
    transactions: [
      {
        id: 'tx_init',
        amount: 10,
        type: 'daily_checkin',
        description: 'First sign up bonus!',
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultState));
      return defaultState;
    }

    const state: CreditState = JSON.parse(saved);
    
    // Check for daily reset (if date changed)
    const today = new Date().toLocaleDateString();
    if (state.date !== today) {
      state.date = today;

      const oldBalance = state.balance;

      if (state.balance < 10) {
        const topUpAmount = 10 - oldBalance;
        state.balance = 10;

        const resetTx: CreditTransaction = {
          id: `tx_reset_${Date.now()}`,
          amount: topUpAmount,
          type: 'daily_checkin',
          description: 'Daily baseline credit top-up',
          timestamp: new Date().toISOString()
        };

        state.transactions.push(resetTx);
      }

      delete state.completedTasks['daily_checkin'];
      delete state.completedTasks['share_x'];

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }

    return state;
  } catch (e) {
    return defaultState;
  }
}

export function saveCreditState(state: CreditState) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function spendCredits(amount: number, description: string): { success: boolean; state?: CreditState } {
  const state = loadCreditState();
  if (state.balance < amount) {
    return { success: false };
  }

  state.balance -= amount;
  
  const tx: CreditTransaction = {
    id: `tx_spend_${Date.now()}`,
    amount: -amount,
    type: 'spend',
    description: description,
    timestamp: new Date().toISOString()
  };
  
  state.transactions.push(tx);
  saveCreditState(state);
  
  return { success: true, state };
}

export function refundCredits(amount: number, description: string): CreditState {
  const state = loadCreditState();
  state.balance += amount;

  const tx: CreditTransaction = {
    id: `tx_refund_${Date.now()}`,
    amount: amount,
    type: 'refund',
    description: description,
    timestamp: new Date().toISOString()
  };

  state.transactions.push(tx);
  saveCreditState(state);
  return state;
}

export function claimGrowthReward(
  taskId: string,
  reward: number,
  description: string,
  allowOnce: boolean = false
): { success: boolean; state: CreditState; error?: string; errorCode?: 'TASK_ALREADY_COMPLETED' | 'DAILY_LIMIT_REACHED' } {
  const state = loadCreditState();
  const today = new Date().toLocaleDateString();

  if (allowOnce && state.completedTasks[taskId]) {
    return { success: false, state, error: 'This task has already been completed.', errorCode: 'TASK_ALREADY_COMPLETED' };
  }

  // Double check tasks checkin or share_x which are daily limited
  if (taskId === 'daily_checkin' || taskId === 'share_x') {
    if (state.completedTasks[taskId] === today) {
      return { success: false, state, error: 'Daily limit reached for this task today.', errorCode: 'DAILY_LIMIT_REACHED' };
    }
    state.completedTasks[taskId] = today;
  } else {
    state.completedTasks[taskId] = new Date().toISOString();
  }

  state.balance += reward;

  const tx: CreditTransaction = {
    id: `tx_reward_${taskId}_${Date.now()}`,
    amount: reward,
    type: taskId as any,
    description: description,
    timestamp: new Date().toISOString()
  };

  state.transactions.push(tx);
  saveCreditState(state);

  return { success: true, state };
}
