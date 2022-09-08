import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { IUserContext, ISignUp } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const UserContext = createContext<IUserContext | null>(null);

const UserContextProvider = ({ children }: IChildren) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<null | boolean>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();

    console.log(session?.user, 'asdas');
    //@ts-ignore
    setUser(session?.user ?? null);
    setLoading(false);

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(session);
      // @ts-ignore
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);
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
    signUp,
    userExists,
    setUserExists,
    checkUserExists,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
