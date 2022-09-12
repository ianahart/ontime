import billsStyles from '../../styles/components/dashboard/Bills.module.scss';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalForm from './ModalForm';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../context/user';
import { IBillContext, IUserContext } from '../../interfaces';
import { BillContext } from '../../context/bill';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import Bill from './Bill';
import { nanoid } from 'nanoid';
const Bills = () => {
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const { getBills, bills } = useContext(BillContext) as IBillContext;
  const handleOpenModalForm = () => {
    setModalFormOpen(true);
  };

  const handleCloseModalForm = () => {
    setModalFormOpen(false);
  };

  useEffectOnce(() => {
    const session = localStorage.getItem('supabase.auth.token');
    const user = JSON.parse(session ?? '').currentSession.user;
    if (!bills.length) {
      getBills(user.id);
    }
  });

  return (
    <div className={billsStyles.container}>
      {modalFormOpen && <ModalForm handleCloseModalForm={handleCloseModalForm} />}
      <div className={billsStyles.billsContainer}>
        {bills.map((bill) => {
          return <Bill key={nanoid()} bill={bill} />;
        })}
      </div>
      <div style={{ margin: '4rem 0' }}></div>
      <div
        onClick={handleOpenModalForm}
        role="button"
        className={billsStyles.addBillContainer}
      >
        <p>Add Bill</p>
        <AiOutlinePlus />
      </div>
    </div>
  );
};

export default Bills;
