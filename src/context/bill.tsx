import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { IBill, IBillContext } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const BillContext = createContext<IBillContext | null>(null);

const BillContextProvider = ({ children }: IChildren) => {
  const [bills, setBills] = useState<IBill[]>([]);

  const getBills = async (user_id: string) => {
    const { data } = await supabase
      .from<IBill>('bills')
      .select('amount, id, user_id, company, date, formatted_date, is_toggled')
      .eq('user_id', user_id);

    if (data) {
      setBills((prevState) => [...prevState, ...data]);
    }
  };

  const value = { getBills, bills };
  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};

export default BillContextProvider;
