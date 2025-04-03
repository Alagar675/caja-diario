
import { Withdrawal } from "@/types/finance";

export const useWithdrawalOperations = (withdrawals: Withdrawal[], userId: string | undefined) => {
  const getTotalWithdrawals = () => {
    if (!userId) {
      return {
        cashWithdrawals: 0,
        transferWithdrawals: 0,
        creditWithdrawals: 0,
        totalWithdrawals: 0
      };
    }

    const userWithdrawals = withdrawals.filter(w => w.userId === userId);
    
    const cashWithdrawals = userWithdrawals
      .filter(w => w.source === "cash")
      .reduce((total, w) => total + w.amount, 0);
      
    const transferWithdrawals = userWithdrawals
      .filter(w => w.source === "transfer")
      .reduce((total, w) => total + w.amount, 0);
      
    const creditWithdrawals = userWithdrawals
      .filter(w => w.source === "credit")
      .reduce((total, w) => total + w.amount, 0);
    
    return {
      cashWithdrawals,
      transferWithdrawals,
      creditWithdrawals,
      totalWithdrawals: cashWithdrawals + transferWithdrawals + creditWithdrawals
    };
  };

  return {
    getTotalWithdrawals
  };
};
