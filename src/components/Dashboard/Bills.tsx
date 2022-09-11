import billsStyles from '../../styles/components/dashboard/Bills.module.scss';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalForm from './ModalForm';
import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../../context/user';
import { IBillContext, IUserContext } from '../../interfaces';
import { BillContext } from '../../context/bill';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
const Bills = () => {
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const { getBills } = useContext(BillContext) as IBillContext;
  const handleOpenModalForm = () => {
    setModalFormOpen(true);
  };

  const handleCloseModalForm = () => {
    setModalFormOpen(false);
  };

  useEffectOnce(() => {
    const session = localStorage.getItem('supabase.auth.token');
    const user = JSON.parse(session ?? '').currentSession.user;
    console.log(user.id);
    getBills(user.id);
  });

  return (
    <div className={billsStyles.container}>
      {modalFormOpen && <ModalForm handleCloseModalForm={handleCloseModalForm} />}
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
