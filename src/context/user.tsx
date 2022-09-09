import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { IUserContext, IProfile, ISignUp, ISession, IUser } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const UserContext = createContext<IUserContext | null>(null);

const UserContextProvider = ({ children }: IChildren) => {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [session, setSession] = useState<ISession | null>(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<null | boolean>(null);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);

    const reFetchProfile = async (user: IUser) => {
      await getProfile(user);
    };
    if (session?.user) {
      reFetchProfile(session?.user);
    }

    setLoading(false);

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(session);
      setLoading(false);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const getProfile = async (user: IUser) => {
    const profile = await supabase.from('profile').select().eq('id', user.id).single();
    setProfile(profile.data);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  const signIn = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (user) {
      getProfile(user);
    }

    if (error) {
      setLoginError(error.message);
    }
  };

  const signUp = async (data: ISignUp) => {
    await checkUserExists(data.email);
    await supabase.auth.signUp(
      {
        email: data.email,
        password: data.password,
      },
      {
        data: {
          full_name: data.full_name,
        },
      }
    );
  };

  const checkUserExists = async (email: string) => {
    const { data } = await supabase.from('profile').select('id').eq('email', email);

    if (data) {
      setUserExists(data.length > 0 ? true : false);
      return;
    }

    setUserExists(null);
  };

  const value = {
    profile,
    loginError,
    signUp,
    signOut,
    signIn,
    userExists,
    setUserExists,
    checkUserExists,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
