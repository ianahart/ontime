import { ChangeEvent } from 'react';
import contactFormInputStyles from '../../styles/components/dashboard/ContactFormInput.module.scss';

interface IContactFormInputProps {
  name: string;
  value: string;
  error: string;
  label: string;
  updateForm: (name: string, value: string, prop: string) => void;
}

const ContactFormInput = ({
  name,
  value,
  error,
  label,
  updateForm,
}: IContactFormInputProps) => {
  const handleOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim().length === 0 || value.trim().length > 100) {
      const error = `${label} must be between 1 and 100 characters.`;
      updateForm(name, error, 'error');
    }
  };

  const handleOnFocus = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    updateForm(name, '', 'error');
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  return (
    <div className={contactFormInputStyles.formGroup}>
      <label>{label}</label>
      {error && <p className={contactFormInputStyles.error}>{error}</p>}
      <input
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        onChange={handleOnChange}
        name={name}
        value={value}
      />
    </div>
  );
};

export default ContactFormInput;
