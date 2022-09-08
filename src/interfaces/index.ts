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

export interface IUserContext {
  signUp: ({ email, full_name, password }: ISignUp) => void;
  userExists: boolean | null;
  setUserExists: (userExists: boolean | null) => void;
}
