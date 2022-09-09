import {
  ChangeEvent,
  DragEvent,
  FormEvent,
  MouseEvent,
  useContext,
  useState,
} from 'react';
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineUpload,
} from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/user';
import { IUserContext } from '../interfaces';
import settingsStyles from '../styles/components/settings/Settings.module.scss';

const Settings = () => {
  const { updateUserFullName, updateUserAvatar } = useContext(
    UserContext
  ) as IUserContext;
  const [fullName, setFullName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [draggingOver, setDraggingOver] = useState(false);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleOnFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file: File = e.target.files[0];
    setFile(file);
  };

  const handleClearUpload = (e: MouseEvent<HTMLParagraphElement>) => {
    e.stopPropagation();
    setFile(null);
  };

  const notify = () => toast('Profile updated.');

  const handleOnDrop = (e: DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fullName.trim().length > 0) {
      updateUserFullName(fullName);
    }

    notify();
    if (file !== null) {
      updateUserAvatar(file);
    }
    // upload file
    // get public linnk
  };

  return (
    <div className={settingsStyles.container}>
      <div className={settingsStyles.formContainer}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <form onSubmit={handleOnSubmit}>
          <h3>Your Settings</h3>
          <div className={settingsStyles.formGroup}>
            <label>Full Name</label>
            <input
              onChange={handleTextChange}
              type="text"
              value={fullName}
              name="fullname"
            />
          </div>
          <div className={settingsStyles.imageUploadContainer}>
            <label>Profile Picture</label>
            <div onDrop={handleOnDrop} className={settingsStyles.imageUpload}>
              {file?.name && (
                <div onClick={handleClearUpload} className={settingsStyles.clearUpload}>
                  <p>Clear</p>
                </div>
              )}

              <div className={settingsStyles.imageUploadBorder}>
                <div className={settingsStyles.fileInput}>
                  {file?.name && (
                    <div className={settingsStyles.check}>
                      <AiOutlineCheckCircle />
                    </div>
                  )}
                  <p className={settingsStyles.fileName}>{file?.name}</p>
                  <input onChange={handleOnFileChange} type="file" />
                </div>
              </div>
            </div>
          </div>
          <div className={settingsStyles.btnContainer}>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;