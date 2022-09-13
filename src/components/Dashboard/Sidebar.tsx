import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GrNotes } from 'react-icons/gr';
import { UserContext } from '../../context/user';
import { IUserContext } from '../../interfaces';
import { FaUserCircle, FaRegMoneyBillAlt } from 'react-icons/fa';
import { AiOutlineHome } from 'react-icons/ai';
import sidebarStyles from '../../styles/components/dashboard/Sidebar.module.scss';

const Sidebar = () => {
  const { profile } = useContext(UserContext) as IUserContext;
  return (
    <div className={sidebarStyles.container}>
      <div className={sidebarStyles.divider}></div>
      <div className={sidebarStyles.header}>
        {profile?.avatar_url ? (
          <img src={profile.avatar_url} alt={profile.full_name} />
        ) : (
          <FaUserCircle />
        )}
        <p>{profile?.full_name}</p>
      </div>

      <div className={sidebarStyles.linksContainer}>
        <Link to="/dashboard/home">
          <div className={sidebarStyles.linkContainer}>
            <AiOutlineHome />
            <p>Home</p>
          </div>
        </Link>
        <Link to="/dashboard/bills">
          <div className={sidebarStyles.linkContainer}>
            <FaRegMoneyBillAlt />
            <p>Bills</p>
          </div>
        </Link>
        <Link to="/dashboard/notes">
          <div className={sidebarStyles.linkContainer}>
            <GrNotes />
            <p>Notes</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
