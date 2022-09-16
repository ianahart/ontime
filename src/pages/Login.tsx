import { useEffect, ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { BackgroundContext } from '../context/background';
import { UserContext } from '../context/user';
import { IBackgroundContext, IUserContext } from '../interfaces';
import loginStyles from '../styles/pages/Login.module.scss';

const Login = () => {
  const navigate = useNavigate();
  const { getBackground } = useContext(BackgroundContext) as IBackgroundContext;
  const { profile, signIn, loginError } = useContext(UserContext) as IUserContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (email.trim().length === 0 || password.trim().length === 0) {
      setError('Please fill in both fields.');
      return;
    }
    signIn(email, password);
  };

  useEffect(() => {
    if (profile !== null) {
      const fetch = async () => {
        await getBackground(profile.id);
      };
      fetch();
      navigate('/dashboard/home');
    }
  }, [profile, navigate, getBackground]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    name === 'password' ? setPassword(value) : setEmail(value);
  };

  return (
    <div className={loginStyles.container}>
      <div className={loginStyles.link}>
        <Link to="/sign-up">Create account</Link>
      </div>
      <div className={loginStyles.formContainer}>
        <form onSubmit={handleOnSubmit}>
          <header>
            <h3>Sign in to your account</h3>
            {error && <p className="error">{error}</p>}
            {loginError && <p className="error">{loginError}</p>}
          </header>

          <div className={loginStyles.formGroup}>
            <label>Email</label>
            <input type="email" name="email" onChange={handleOnChange} value={email} />
          </div>
          <div className={loginStyles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              onChange={handleOnChange}
              value={password}
            />
          </div>
          <div className={loginStyles.btnContainer}>
            <button type="submit">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
