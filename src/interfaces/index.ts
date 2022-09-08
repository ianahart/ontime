export interface IRegisterForm {
  full_name: { name: string; value: string; error: string; type: string };
  email: { name: string; value: string; error: string; type: string };
  password: { name: string; value: string; error: string; type: string };
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
}

export interface IUserContext {
  profile: IProfile | null;
  loginError: string;
  userExists: boolean | null;
  signIn: (email: string, password: string) => void;
  signUp: ({ email, full_name, password }: ISignUp) => void;
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
