import { createContext, useState } from 'react';
import supabase from '../config/supabaseClient';
import { INoteContext, INote } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const NoteContext = createContext<INoteContext | null>(null);

const NoteContextProvider = ({ children }: IChildren) => {
  const [note, setNote] = useState({ id: '', note: '' });

  const noteExists = async (user_id: string): Promise<boolean> => {
    const note = await getNote(user_id);
    return note ? true : false;
  };

  const getNote = async (user_id: string): Promise<INote | void> => {
    const { data, error } = await supabase
      .from('notes')
      .select('id, note')
      .eq('user_id', user_id);

    if (error) {
      return;
    }
    if (data.length) {
      const [newNote] = data;
      setNote(newNote);
      return newNote;
    }
  };

  const saveNote = async (note: string, user_id: string) => {
    const exists = await noteExists(user_id);
    if (exists) {
      updateNote(note, user_id);
    } else {
      insertNote(note, user_id);
    }
  };

  const insertNote = async (note: string, user_id: string) => {
    await supabase.from('notes').insert([{ note, user_id }]);
  };

  const updateNote = async (note: string, user_id: string) => {
    await supabase
      .from('notes')
      .update({
        note,
      })
      .match({ user_id });
  };

  const value = { saveNote, getNote, note };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteContextProvider;
