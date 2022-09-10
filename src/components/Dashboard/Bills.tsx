import billsStyles from '../../styles/components/dashboard/Bills.module.scss';
import { AiOutlinePlus } from 'react-icons/ai';
const Bills = () => {
  return (
    <div className={billsStyles.container}>
      <div role="button" className={billsStyles.addBillContainer}>
        <div></div>
        <p>Add Bill</p>
        <AiOutlinePlus />
      </div>
    </div>
  );
};

export default Bills;
