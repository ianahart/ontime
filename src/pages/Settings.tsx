import settingsStyles from '../styles/components/settings/Settings.module.scss';
import supabase from '../config/supabaseClient';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { UserContext } from '../context/user';
import { IUserContext } from '../interfaces';
import { useContext, ChangeEvent, MouseEvent, useState } from 'react';
const Settings = () => {
  const { signOut } = useContext(UserContext) as IUserContext;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [type, setType] = useState('password');
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'new_password') {
      setNewPassword(value);
      return;
    }
    setConfirmPassword(value);
  };

  const handlePasswordChange = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (newPassword.trim().length === 0 || confirmPassword.trim().length === 0) {
      setError('Please fill out both fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const { user: authUser, error: fetchError } = await supabase.auth.update({
      password: newPassword,
    });

    signOut();
    setConfirmPassword('');
    setNewPassword('');
    setMessage('Your password has been updated.');
  };

  return (
    <div className={settingsStyles.container}>
      <div className={settingsStyles.formContainer}>
        <div className={settingsStyles.header}>
          <header>
            <h3>Your Settings</h3>
            {message && <p className={settingsStyles.message}>{message}</p>}
          </header>
        </div>
        <div className={settingsStyles.formGroupTitle}>
          <h3>Change Password</h3>
          <p>Resetting your password will log you out of your account.</p>
          {error && <h4 className={settingsStyles.error}>{error}</h4>}
        </div>
        <div className={settingsStyles.formGroupContainer}>
          <div className={settingsStyles.formGroup}>
            <label>New Password:</label>
            <div className={settingsStyles.input}>
              <input
                onChange={handleOnChange}
                name="new_password"
                value={newPassword}
                type={type}
              />
              {type === 'text' ? (
                <div className={settingsStyles.icon} onClick={() => setType('password')}>
                  <AiOutlineEyeInvisible />
                </div>
              ) : (
                <div className={settingsStyles.icon} onClick={() => setType('text')}>
                  <AiOutlineEye />
                </div>
              )}
            </div>
          </div>
          <div className={settingsStyles.formGroup}>
            <label>Re-enter Password:</label>
            <input
              onChange={handleOnChange}
              name="confirm_password"
              value={confirmPassword}
              type={type}
            />
          </div>
        </div>
        <div className={settingsStyles.btnContainer}>
          <button onClick={handlePasswordChange}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
