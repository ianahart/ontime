import { useEffect, FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import formStyles from '../../styles/components/register/Form.module.scss';
import { registerState } from '../../data/initialState';
import { IRegisterForm, IUserContext } from '../../interfaces';
import FormInput from '../Mixed/FormInput';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/user';

const Form = () => {
  const navigate = useNavigate();
  const { signUp, userExists, setUserExists } = useContext(UserContext) as IUserContext;
  const [form, setForm] = useState<IRegisterForm>(registerState);
  const [emptyFieldError, setEmptyFieldError] = useState('');

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IRegisterForm], [prop]: value },
    }));
  };

  const validateEmptyFields = () => {
    let empty = false;
    for (const [_, field] of Object.entries(form)) {
      if (field.value.trim().length === 0) {
        empty = true;
      }
    }
    return empty;
  };

  const validateFields = () => {
    let errors = false;
    for (const [_, field] of Object.entries(form)) {
      if (field.error.length) {
        errors = true;
      }
    }
    return errors;
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFields()) {
      return;
    }
    setEmptyFieldError('');
    setUserExists(null);
    if (validateEmptyFields()) {
      setEmptyFieldError('Please make sure to fill out all fields.');
      return;
    }
    signUp({
      email: form.email.value,
      full_name: form.full_name.value,
      password: form.password.value,
    });
  };

  useEffect(() => {
    if (userExists) {
      setEmptyFieldError('A user with that email already exists.');
    } else if (userExists === false && userExists !== null) {
      navigate('/');
    }
  }, [userExists]);

  return (
    <div className={formStyles.container}>
      <div className={formStyles.formContainer}>
        <form onSubmit={handleOnSubmit}>
          <h3>Create an account with OnTime</h3>
          {emptyFieldError && <p className={formStyles.error}>{emptyFieldError}</p>}
          <FormInput
            updateForm={updateForm}
            value={form.email.value}
            error={form.email.error}
            name={form.email.name}
            type={form.email.type}
            label="Email"
          />
          <FormInput
            updateForm={updateForm}
            value={form.full_name.value}
            error={form.full_name.error}
            name={form.full_name.name}
            type={form.full_name.type}
            label="Full Name"
          />
          <FormInput
            updateForm={updateForm}
            value={form.password.value}
            error={form.password.error}
            name={form.password.name}
            type={form.password.type}
            label="Password"
          />
          <div className={formStyles.login}>
            <p>Already have an account?</p>
            <Link to="/">Sign in</Link>
          </div>
          <div className={formStyles.buttonContainer}>
            <button type="submit">Create account</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Form;
