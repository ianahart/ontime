import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { IBill, IBillContext, IBillForm } from '../interfaces';
import { Calendar } from '../types';
interface IChildren {
  children: React.ReactNode;
}

export const BillContext = createContext<IBillContext | null>(null);

const BillContextProvider = ({ children }: IChildren) => {
  const [bills, setBills] = useState<IBill[]>([]);

  const getBills = async (user_id: string) => {
    const { data } = await supabase
      .from<IBill>('bills')
      .select('amount, id, user_id, company, due_date, formatted_date, is_toggled')
      .eq('user_id', user_id);

    if (data) {
      setBills((prevState) => [...prevState, ...data]);
    }
  };

  const insertBill = async (user: string, form: IBillForm, date: string) => {
    const { data } = await supabase.from('bills').insert([
      {
        user_id: user,
        amount: parseInt(form.amount.value),
        company: form.company.value,
        due_date: form.due_date.value,
        formatted_date: date,
      },
    ]);
    if (data) {
      setBills((prevState: any) => [...prevState, data]);
    }
  };

  const handleBillChange = (name: string, value: string, id: number) => {
    const updatedBills = bills.map((bill) => {
      if (bill.id === id) {
        bill[name] = value;
      }
      return bill;
    });
    setBills(updatedBills);
  };

  const updateBillCalendar = async (formattedDate: string, date: Date, id: number) => {
    const updatedBills = bills.map((bill) => {
      if (bill.id === id) {
        bill.formatted_date = formattedDate;
        bill.due_date = date;
      }
      return bill;
    });
    setBills(updatedBills);
    await supabase
      .from('bills')
      .update({ formatted_date: formattedDate, due_date: date })
      .match({ id });
  };

  const updateBillInput = async (name: string, value: string, id: number) => {
    await supabase
      .from('bills')
      .update({ [name]: value })
      .match({ id });
  };

  const deleteBill = async (id: number) => {
    const filtered = bills.filter((bill) => bill.id !== id);
    setBills(filtered);
    await supabase.from('bills').delete().match({ id });
  };

  const value = {
    getBills,
    bills,
    insertBill,
    updateBillInput,
    handleBillChange,
    updateBillCalendar,
        deleteBill,
  };
  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};

export default BillContextProvider;
