import noteStyles from '../../styles/components/dashboard/NoteStyles.module.scss';
import { INote, INoteContext, IUserContext } from '../../interfaces';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MouseEvent, useContext, useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { NoteContext } from '../../context/note';

import { UserContext } from '../../context/user';
interface INoteProps {
  note: INote;
}

const Note = ({ note }: INoteProps) => {
  const { profile } = useContext(UserContext) as IUserContext;
  const { deleteNote, updateNote } = useContext(NoteContext) as INoteContext;
  const [value, setValue] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setValue(note.note);
  }, [note.note]);

  const closeModal = () => {
    setModal(false);
  };

  const openModal = () => {
    setModal(true);
  };

  const handleUpdate = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (profile) {
      await updateNote(value, note.id, profile?.id);
      closeModal();
    }
  };

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (profile) {
      await deleteNote(note.id, profile?.id);
      closeModal();
    }
  };
  return (
    <div className={noteStyles.container}>
      {modal && (
        <div className={noteStyles.modal}>
          <div onClick={closeModal} className={noteStyles.closeIcon}>
            <AiOutlineClose />
          </div>
          <div className={noteStyles.quillContainer}>
            <ReactQuill theme="snow" value={value} onChange={setValue} />
          </div>
          <div className={noteStyles.btnContainer}>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      )}
      <p onClick={openModal}>{note.title}</p>
    </div>
  );
};

export default Note;
