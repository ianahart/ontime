import { Calendar } from '../types';

export interface IRegisterForm {
  full_name: { name: string; value: string; error: string; type: string };
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
}

export interface IBillForm {
  company: { name: string; value: string; error: string };
  due_date: {
    name: string;
    value: Date | [Date | null, Date | null] | null | undefined;
    error: string;
  };
  amount: { name: string; value: string; error: string };
}

export interface ISignUp {
  full_name: string;
  email: string;
  password: string;
}

export interface IProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  file_name: string;
}

export interface IBillContext {
  getBills: (user_id: string) => void;
  bills: IBill[];
  insertBill: (user: string, form: IBillForm, formatted_date: string) => Promise<void>;
  updateBillInput: (name: string, value: string, id: number) => Promise<void>;
  updateBillCalendar: (formatted_date: string, date: Date, id: number) => Promise<void>;
  handleBillChange: (name: string, value: string, id: number) => void;
}

export interface IBill {
  [key: string]: any;
  amount: number;
  company: string;
  due_date: Date;
  user_id: string;
  formatted_date: string;
  id: number;
  is_toggled: boolean;
}

export interface IUserContext {
  profile: IProfile | null;
  loginError: string;
  userExists: boolean | null;
  session: ISession | null;
  signIn: (email: string, password: string) => void;
  signUp: ({ email, full_name, password }: ISignUp) => void;
  signOut: () => void;
  updateUserFullName: (name: string) => void;
  updateUserAvatar: (file: File) => void;
  setUserExists: (userExists: boolean | null) => void;
}

export interface ISession {
  provider_token?: string | null;
  access_token: string;
  expires_in?: number;
  expires_at?: number;
  refresh_token?: string;
  token_type: string;
  user: IUser | null;
}

export interface IUser {
  id: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  aud: string;
  confirmation_sent_at?: string;
  email?: string;
  created_at: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  role?: string;
  updated_at?: string;
}
