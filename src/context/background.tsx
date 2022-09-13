import { createContext, useState, useEffect } from 'react';
import supabase from '../config/supabaseClient';
import { backgroundState } from '../data/initialState';
import { IBackground, IBackgroundContext } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const BackgroundContext = createContext<IBackgroundContext | null>(null);

const BackgroundContextProvider = ({ children }: IChildren) => {
  const [background, setBackground] = useState<IBackground>(backgroundState);

  const resetBackground = () => setBackground(backgroundState);

  const getBackground = async (user_id: string) => {
    const data = await fetchBackground(user_id);
    if (data) {
      const [background] = data;
      setBackground(background);
    }
  };

  const fetchBackground = async (user_id: string) => {
    const { data } = await supabase
      .from<IBackground>('backgrounds')
      .select()
      .eq('user_id', user_id);
    return data;
  };

  const checkForBackground = async (user_id: string): Promise<boolean> => {
    const data = await fetchBackground(user_id);

    if (data && data.length) {
      await deleteFromStorage(data[0].background_file_name);
      return true;
    }
    return false;
  };

  const updateBackground = async (
    background_url: string,
    file_name: string,
    user_id: string
  ) => {
    const { data, error } = await supabase
      .from('backgrounds')
      .update({
        background_url,
        background_file_name: file_name,
      })
      .match({ user_id });
    if (data) {
      const [background] = data;
      setBackground(background);
    }
  };

  const insertBackground = async (
    background_url: string,
    background_file_name: string,
    user_id: string
  ) => {
    const { data, error } = await supabase.from('backgrounds').insert([
      {
        background_url,
        background_file_name,
        user_id,
      },
    ]);
    if (data) {
      const [background] = data;
      setBackground(background);
    }
  };

  const uploadBackground = async (
    file: File,
    file_name: string,
    user_id: string
  ): Promise<void> => {
    const backgroundExists = await checkForBackground(user_id);
    await uploadToStorage(file, file_name);
    const { publicURL } = supabase.storage.from('backgrounds').getPublicUrl(file_name);

    if (backgroundExists && publicURL) {
      await updateBackground(publicURL, file_name, user_id);
    } else {
      if (publicURL) {
        insertBackground(publicURL, file_name, user_id);
      }
    }
  };

  const deleteFromStorage = async (file_name: string) => {
    await supabase.storage.from('backgrounds').remove([file_name]);
  };

  const uploadToStorage = async (file: File, file_name: string): Promise<void> => {
    await supabase.storage.from('backgrounds').upload(file_name, file, {
      cacheControl: '3600',
      upsert: false,
    });
  };

  const value = { resetBackground, uploadBackground, background, getBackground };
  return (
    <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>
  );
};

export default BackgroundContextProvider;
