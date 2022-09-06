import formStyles from '../../styles/components/register/Form.module.scss';

const Form = () => {
  return (
    <div className={formStyles.container}>
      <div className={formStyles.formContainer}>
        <form>
          <h3>Create an account with OnTime</h3>
        </form>
      </div>
    </div>
  );
};
export default Form;
