import React from 'react';
import { useContext } from 'react';
import { BillContext } from '../../context/bill';
import { IBill, IBillContext } from '../../interfaces';
import billStyles from '../../styles/components/dashboard/Bill.module.scss';

interface IToggleBtnProps {
  id: number;
  is_toggled: boolean;
}

const ToggleBtn = ({ id, is_toggled }: IToggleBtnProps) => {
  const { toggleRunningBtn } = useContext(BillContext) as IBillContext;
  const handleToggle = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    await toggleRunningBtn(id, !is_toggled);
  };

  return (
    <div
      style={{ background: is_toggled ? 'limegreen' : 'gray' }}
      onClick={handleToggle}
      className={billStyles.toggleBtnContainer}
    >
      <div
        className={` ${is_toggled ? billStyles.toggleOn : billStyles.toggleOff} `}
      ></div>
    </div>
  );
};

export default React.memo(ToggleBtn);
