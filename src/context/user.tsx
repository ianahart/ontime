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
      setSession(session);
      setLoading(false);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  const getProfile = async (user: IUser) => {
    const profile = await supabase
      .from<IProfile>('profile')
      .select()
      .eq('id', user.id)
      .single();
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

  const updateUserFullName = async (newName: string) => {
    const { data, error } = await supabase
      .from('profile')
      .update({ full_name: newName })
      .match({ id: session?.user?.id });

    await supabase.auth.update({
      data: { full_name: newName },
    });
    if (!error) {
      setProfile((prevState: any) => ({
        ...prevState,
        full_name: newName,
      }));
    }
  };

  const checkUserExists = async (email: string) => {
    const { data } = await supabase.from('profile').select('id').eq('email', email);

    if (data) {
      setUserExists(data.length > 0 ? true : false);
      return;
    }

    setUserExists(null);
  };

  const preformUpdate = async (filePath: string, publicURL: string | null) => {
    await supabase
      .from('profile')
      .update({ avatar_url: publicURL, file_name: filePath })
      .match({ id: session?.user?.id });
  };

  const uploadToStorage = async (fileName: string, file: File) => {
    await supabase.storage.from('avatars').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });
  };

  const deleteFromStorage = async (fileName: string) => {
    await supabase.storage.from('avatars').remove([fileName]);
  };

  const createFileName = (file: File) => {
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    const filePath = `${session?.user?.id}/${secondsSinceEpoch}-${file.name}`;

    return filePath;
  };

  const updateUserAvatar = async (file: File) => {
    const fileName = createFileName(file);

    await uploadToStorage(fileName, file);
    if (profile?.file_name) {
      await deleteFromStorage(profile?.file_name);
    }

    const { publicURL } = supabase.storage.from('avatars').getPublicUrl(fileName);
    await preformUpdate(fileName, publicURL);

    setProfile((prevState: any) => ({
      ...prevState,
      avatar_url: publicURL,
      file_name: fileName,
    }));
  };

  const value = {
    profile,
    loginError,
    signUp,
    updateUserFullName,
    updateUserAvatar,
    signOut,
    signIn,
    userExists,
    setUserExists,
    checkUserExists,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
