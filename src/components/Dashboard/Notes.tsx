import { useEffect, MouseEvent, useContext, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import notesStyles from '../../styles/components/dashboard/Notes.module.scss';
import { UserContext } from '../../context/user';
import { INoteContext, IUserContext } from '../../interfaces';
import { NoteContext } from '../../context/note';
const Notes = () => {
  const { profile } = useContext(UserContext) as IUserContext;
  const { note, saveNote, getNote } = useContext(NoteContext) as INoteContext;
  const [value, setValue] = useState('');
  const [mode, setMode] = useState('readOnly');

  const handleEditBtn = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMode('save');
  };

  useEffect(() => {
    const fetchNote = async () => {
      if (profile) {
        const note = await getNote(profile?.id);
        if (note) {
          setValue(note.note);
        }
      }
    };
    fetchNote();
  }, [note?.note, profile?.id]);

  const handleSaveBtn = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (profile) {
      await saveNote(value, profile.id);
    }
    setMode('readOnly');
  };

  return (
    <div className={notesStyles.container}>
      <div className={notesStyles.quillContainer}>
        <div className={notesStyles.btnContainer}>
          {mode === 'readOnly' ? (
            <button onClick={handleEditBtn} className={notesStyles.edit}>
              Edit
            </button>
          ) : (
            <button onClick={handleSaveBtn} className={notesStyles.save}>
              Save
            </button>
          )}
        </div>
        <ReactQuill
          readOnly={mode === 'readOnly' ? true : false}
          theme="snow"
          value={value}
          onChange={setValue}
        />
      </div>
    </div>
  );
};

export default Notes;
