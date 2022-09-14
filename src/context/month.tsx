import { createContext, useState } from 'react';
import supabase from '../config/supabaseClient';
import { IMonthContext } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const MonthContext = createContext<IMonthContext | null>(null);

const MonthContextProvider = ({ children }: IChildren) => {
  const checkIfMonthChanged = async (month: string): Promise<boolean | void> => {
    const { data } = await supabase.from('months').select('id');

    if (!data?.length) {
      await supabase.from('months').insert([{ month }]);
      return;
    }

    const { data: monthsSame } = await supabase.from('months').select('month').single();
    return month !== monthsSame.month ? true : false;
  };

  const value = {
    checkIfMonthChanged,
  };
  return <MonthContext.Provider value={value}>{children}</MonthContext.Provider>;
};

export default MonthContextProvider;
