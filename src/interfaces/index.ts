import { Calendar } from '../types';

export interface IRegisterForm {
  full_name: { name: string; value: string; error: string; type: string };
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
}

export interface IContactForm {
  company: { name: string; value: string; error: string };
  phone: { name: string; value: string; error: string };
  notes: { name: string; value: string; error: string };
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

export interface IChartData {
  company: string;
  amount: number;
  id: number;
  user_id: number;
}

export interface IEvent {
  title: string;
  user_id: string;
  start: Date;
  end: Date;
  id: number;
  created_at: Date;
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

export interface INote {
  id: string;
  note: string;
  title: string;
}

export interface IBackground {
  background_file_name: string;
  background_url: string;
  created_at: string;
  id: number | null;
  user_id: string;
}

export interface IBackgroundContext {
  uploadBackground: (file: File, file_name: string, user_id: string) => Promise<void>;
  background: IBackground;
  getBackground: (user_id: string) => Promise<void>;
  resetBackground: () => void;
}

export interface INoteContext {
  saveNote: (new_note: string, user_id: string, title: string) => Promise<void>;
  getNotes: (user_id: string) => Promise<INote | void>;
  paginateNotes: (user_id: string) => Promise<INote | void>;
  updateNote: (value: string, note_id: string, user_id: string) => Promise<void>;
  deleteNote: (note_id: string, user_id: string) => Promise<void>;
  notes: INote[];
  resetNotes: () => void;
}

export interface IBillContext {
  getBills: (user_id: string) => Promise<void>;
  bills: IBill[];
  billContextError: string;
  setBillContextError: (value: string) => void;
  billsLoading: boolean;
  billTotal: number;
  resetBills: () => void;
  insertBill: (user: string, form: IBillForm, formatted_date: string) => Promise<void>;
  updateBillInput: (name: string, value: string, id: number) => Promise<void>;
  updateBillCalendar: (formatted_date: string, date: Date, id: number) => Promise<void>;
  handleBillChange: (name: string, value: string, id: number) => void;
  deleteBill: (id: number) => Promise<void>;
  toggleRunningBtn: (id: number, is_toggled: boolean) => Promise<void>;
  calcBillTotal: () => void;
  toggleOffBills: () => Promise<void>;
  getCompanyOrFail: (company: string, user_id: string) => Promise<string | null>;
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
  contacts: { file_url: string }[];
}

export interface IMonthContext {
  checkIfMonthChanged: (month: string) => Promise<boolean | void>;
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

export interface IContact {
  company: string;
  bill_id: number;
  file_url: string;
  phone: string;
  notes: string;
  id: number;
  user_id: string;
}

export interface IContactContext {
  resetContacts: () => void;
  getContacts: (user_id: string) => Promise<void>;
  paginateContacts: (user_id: string) => Promise<void>;
  removeContact: (id: number) => Promise<void>;
  contacts: IContact[];
  insertContact: (
    form: IContactForm,
    file: File | null,
    user_id: string,
    bill_id: string
  ) => Promise<void>;
}
