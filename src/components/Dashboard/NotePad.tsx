import { useEffect, MouseEvent, useContext, useState, ChangeEvent } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import notesStyles from '../../styles/components/dashboard/NotePad.module.scss';
import { UserContext } from '../../context/user';
import { INoteContext, IUserContext } from '../../interfaces';
import { NoteContext } from '../../context/note';
import Note from './Note';
const NotePad = () => {
  const { profile } = useContext(UserContext) as IUserContext;
  const { resetNotes, notes, saveNote, getNotes, paginateNotes } = useContext(
    NoteContext
  ) as INoteContext;
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      if (profile) {
        await getNotes(profile?.id);
      }
    };
    fetchNotes();
    return () => resetNotes();
  }, [profile?.id]);

  const handleSaveBtn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setError('');
    if (title.trim().length === 0) {
      setError('Please fill out a title for the note.');
      return;
    }

    if (profile) {
      await saveNote(value, profile.id, title);
      setValue('');
      setTitle('');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const loadMoreNotes = () => {
    if (profile) {
      paginateNotes(profile?.id);
    }
  };

  return (
    <div className={notesStyles.container}>
      <div className={notesStyles.quillContainer}>
        <div className={notesStyles.btnContainer}>
          <button onClick={handleSaveBtn} className={notesStyles.save}>
            Save
          </button>
        </div>
        <div className={notesStyles.formGroup}>
          <label>Note Title</label>
          <input type="text" value={title} onChange={handleInputChange} />
        </div>
        {error && <p className={notesStyles.error}>{error}</p>}
        <ReactQuill theme="snow" value={value} onChange={setValue} />
        <div className={notesStyles.notesContainer}>
          {notes.map((note) => {
            return <Note key={note.id} note={note} />;
          })}
        </div>
        <div className={notesStyles.loadMore}>
          <button onClick={loadMoreNotes}>More notes...</button>
        </div>
      </div>
    </div>
  );
};

export default NotePad;
