import { createContext, useState } from 'react';
import supabase from '../config/supabaseClient';
import { INoteContext, INote } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const NoteContext = createContext<INoteContext | null>(null);

const NoteContextProvider = ({ children }: IChildren) => {
  const [notes, setNotes] = useState<INote[]>([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(2);
  const LIMIT = 3;

  const fetchNotes = async (user_id: string): Promise<INote[] | void> => {
    const { data } = await supabase
      .from('notes')
      .select('id, note, title')
      .order('id')
      .eq('user_id', user_id)
      .range(from, to);
    if (data) {
      return data;
    }
  };

  const resetNotes = () => {
    setFrom(0);
    setTo(2);
    setNotes([]);
  };

  const getNotes = async (user_id: string): Promise<INote | void> => {
    const data = await fetchNotes(user_id);
    if (data) {
      setNotes(data);
      setFrom(data.length);
      setTo(data.length - 1 + LIMIT);
    }
  };

  const paginateNotes = async (user_id: string): Promise<INote | void> => {
    const data = await fetchNotes(user_id);
    if (data) {
      setNotes((prevState) => [...prevState, ...data]);
      setFrom(notes.length + LIMIT);
      setTo(notes.length + data.length - 1 + LIMIT);
    }
  };

  const updateNote = async (
    note: string,
    note_id: string,
    user_id: string
  ): Promise<void> => {
    await supabase
      .from('notes')
      .update({ note })
      .match({ id: note_id, user_id: user_id });
    const updated = notes.map((noteObj) => {
      return noteObj.id === note_id ? { ...noteObj, note } : noteObj;
    });
    setNotes(updated);
  };

  const saveNote = async (note: string, user_id: string, title: string) => {
    insertNote(note, user_id, title);
  };

  const insertNote = async (note: string, user_id: string, title: string) => {
    const { data } = await supabase.from('notes').insert([{ note, user_id, title }]);
    if (data) {
      setNotes((prevState) => [...prevState, ...data]);
    }
  };

  const deleteNote = async (note_id: string, user_id: string): Promise<void> => {
    resetNotes();
    await supabase.from('notes').delete().match({ id: note_id, user_id });
  };

  const value = {
    resetNotes,
    paginateNotes,
    deleteNote,
    updateNote,
    saveNote,
    getNotes,
    notes,
  };

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
};

export default NoteContextProvider;
