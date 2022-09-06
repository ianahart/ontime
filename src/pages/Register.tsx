import Form from '../components/Register/Form';
import Marketing from '../components/Register/Marketing';
import registerStyles from '../styles/pages/Register.module.scss';

const Register = () => {
  return (
    <div className={registerStyles.container}>
      <div className={registerStyles.content}>
        <Marketing />
        <Form />
      </div>
    </div>
  );
};
export default Register;
