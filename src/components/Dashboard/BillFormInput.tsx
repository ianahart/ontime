import { ChangeEvent } from 'react';
import billFormInputStyles from '../../styles/components/dashboard/BillFormInput.module.scss';

interface IBillFormInputProps {
  name: string;
  value: string;
  error: string;
  label: string;
  updateForm: (name: string, value: string, prop: string) => void;
  direction: string;
}

const BillFormInput = ({
  name,
  value,
  error,
  label,
  updateForm,
  direction,
}: IBillFormInputProps) => {
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
    <div className={`${direction === 'column' ? billFormInputStyles.container : ''}`}>
      <label>{label}</label>
      {error && <p className={billFormInputStyles.error}>{error}</p>}
      <div className={billFormInputStyles.inputContainer}>
        <input
          onBlur={handleOnBlur}
          onFocus={handleOnFocus}
          onChange={handleOnChange}
          name={name}
          value={value}
        />
      </div>
    </div>
  );
};

export default BillFormInput;
