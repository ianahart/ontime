import { createContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import supabase from '../config/supabaseClient';
import { IBill, IBillContext, IBillForm } from '../interfaces';
import { Calendar } from '../types';
import moment from 'moment';
interface IChildren {
  children: React.ReactNode;
}

export const BillContext = createContext<IBillContext | null>(null);

const BillContextProvider = ({ children }: IChildren) => {
  const [bills, setBills] = useState<IBill[]>([]);
  const [billTotal, setBillTotal] = useState(0);
  const [billsLoading, setBillsLoading] = useState(true);
  const [billContextError, setBillContextError] = useState('');

  const resetBills = () => {
    setBills([]);
    setBillTotal(0);
  };

  const calcBillTotal = () => {
    const billTotal = bills.reduce((acc, { is_toggled, amount }) => {
      if (is_toggled) {
        return acc + amount;
      } else {
        return acc;
      }
    }, 0);
    setBillTotal(billTotal);
  };

  const getBills = async (user_id: string): Promise<void> => {
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
      setBills((prevState: any) => [...prevState, ...data]);
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
    const { error } = await supabase
      .from('bills')
      .update({ [name]: value })
      .match({ id });

    if (error) {
      setBillContextError('Amount must be a valid number');
    }
  };
  const deleteBill = async (id: number) => {
    const filtered = bills.filter((bill) => bill.id !== id);
    setBills(filtered);
    await supabase.from('bills').delete().match({ id });
  };

  const toggleRunningBtn = async (id: number, is_toggled: boolean) => {
    const updated = bills.map((bill) => {
      return bill.id === id ? { ...bill, is_toggled } : bill;
    });
    setBills(updated);

    await supabase.from('bills').update({ is_toggled }).match({ id });
  };

  const toggleOffBills = async (): Promise<void> => {
    const updatedBills = bills.map((bill) => {
      const due_date = dayjs(bill.due_date).add(1, 'month');
      let date = due_date?.toString();
      date = dayjs(date).format('MM/DD/YYYY');

      return {
        ...bill,
        is_toggled: false,
        due_date: bill.due_date,
        formatted_date: date,
      };
    });
    setBills(updatedBills);

    await supabase.from('bills').upsert(bills);
    setBillsLoading(false);
  };

  const value = {
    getBills,
    bills,
    billTotal,
    billsLoading,
    resetBills,
    billContextError,
    setBillContextError,
    insertBill,
    updateBillInput,
    handleBillChange,
    updateBillCalendar,
    toggleRunningBtn,
    deleteBill,
    calcBillTotal,
    toggleOffBills,
  };
  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};

export default BillContextProvider;
