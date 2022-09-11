import billsStyles from '../../styles/components/dashboard/Bills.module.scss';
import { AiOutlinePlus } from 'react-icons/ai';
import ModalForm from './ModalForm';
import { useState } from 'react';
const Bills = () => {
  const [modalFormOpen, setModalFormOpen] = useState(false);

  const handleOpenModalForm = () => {
    setModalFormOpen(true);
  };

  const handleCloseModalForm = () => {
    setModalFormOpen(false);
  };

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
