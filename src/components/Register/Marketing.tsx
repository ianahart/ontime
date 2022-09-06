import marketingStyles from '../../styles/components/register/Marketing.module.scss';
import { IoIosCheckmarkCircle } from 'react-icons/io';
const Marketing = () => {
  return (
    <div className={marketingStyles.container}>
      <h3>OnTime</h3>
      <div className={marketingStyles.bullet}>
        <IoIosCheckmarkCircle />
        <p>Keep track of your bills for each month.</p>
      </div>
      <div className={marketingStyles.bullet}>
        <IoIosCheckmarkCircle />
        <p>Write notes down so you don't forget something.</p>
      </div>
      <div className={marketingStyles.bullet}>
        <IoIosCheckmarkCircle />
        <p>Be able to go back and look at previous month bills.</p>
      </div>
    </div>
  );
};
export default Marketing;
