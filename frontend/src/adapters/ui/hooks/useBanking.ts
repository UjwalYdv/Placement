//
//  useBanking.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import { useState } from 'react';
import { BankingOperation } from '../../../core/domain/Banking';
import { BankingService } from '../../infrastructure/api/BankingService';

const bankingService = new BankingService();

export const useBanking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bankSurplus = async (operation: BankingOperation): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await bankingService.bankSurplus(operation);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyBanked = async (operation: BankingOperation): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await bankingService.applyBanked(operation);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { bankSurplus, applyBanked, loading, error };
};
