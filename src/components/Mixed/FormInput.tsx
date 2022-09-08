import { ChangeEvent, MouseEvent } from 'react';
import { useState } from 'react';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai';
import formInputStyles from '../../styles/components/mixed/FormInput.module.scss';

interface IFormInputProps {
  updateForm: (name: string, value: string, prop: string) => void;
  value: string;
  error: string;
  name: string;
  label: string;
  type: string;
}

const FormInput = ({ updateForm, value, error, name, label, type }: IFormInputProps) => {
  const [iconText, setIconText] = useState(false);
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    updateForm(name, value, 'value');
  };

  const validateEmail = (name: string, value: string) => {
    let error = '';
    if (value.trim().length > 100) {
      error = 'Email must be under 100 characters.';
    }
    updateForm(name, error, 'error');
  };

  const validateName = (name: string, value: string) => {
    if (value.trim().length > 125) {
      error = 'Email must be under 100 characters.';
    }
    updateForm(name, error, 'error');
  };

  const validatePassword = (name: string, value: string) => {
    let digit = false;
    let upper = false;
    let lower = false;
    const numberRegex = /\d/;
    if (value.trim().length < 10) {
      updateForm('password', 'Password must bre greater than 10 characters.', 'error');
      return;
    }

    for (const char of value.split('')) {
      if (numberRegex.test(char)) {
        digit = true;
      } else if (char.toLowerCase() === char) {
        lower = true;
      } else if (char.toUpperCase() === char) {
        upper = true;
      }
    }
    const passed = [digit, upper, lower].every((rule) => rule);
    if (!passed) {
      updateForm(
        'password',
        'Please include one lowercase character, one uppercase character, and one digit.',
        'error'
      );
    }
  };

  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    switch (name) {
      case 'email':
        validateEmail(name, value);
        break;
      case 'full_name':
        validateName(name, value);
        break;
      case 'password':
        validatePassword(name, value);
        break;
      default:
        return;
    }
  };

  const handleOnFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    updateForm(name, '', 'error');
  };

  const handleOnClick = (e: MouseEvent<HTMLDivElement>) => {
    type === 'password'
      ? updateForm('password', 'text', 'type')
      : updateForm('password', 'password', 'type');
  };

  return (
    <div className={formInputStyles.container}>
      <label>{label}</label>
      {error && <p className={formInputStyles.error}>{error}</p>}
      <div className={formInputStyles.inputContainer}>
        <input
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          type={type}
          onChange={handleOnChange}
          name={name}
          value={value}
        />
        {name === 'password' && (
          <div
            onMouseLeave={() => setIconText(false)}
            onMouseEnter={() => setIconText(true)}
            onClick={handleOnClick}
            className={formInputStyles.eye}
          >
            {type === 'password' ? (
              <div className={formInputStyles.iconContainer}>
                {iconText && (
                  <p className={formInputStyles.passwordHelper}>Show password</p>
                )}
                <AiFillEye />
              </div>
            ) : (
              <div className={formInputStyles.iconContainer}>
                {iconText && (
                  <p className={formInputStyles.passwordHelper}>Hide password</p>
                )}
                <AiFillEyeInvisible />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FormInput;
