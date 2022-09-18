import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GrNotes } from 'react-icons/gr';
import { UserContext } from '../../context/user';
import { INoteContext, IUserContext } from '../../interfaces';
import { FaUserCircle, FaRegMoneyBillAlt } from 'react-icons/fa';
import { AiOutlineContacts, AiOutlineCalendar, AiOutlineHome } from 'react-icons/ai';
import sidebarStyles from '../../styles/components/dashboard/Sidebar.module.scss';
import { NoteContext } from '../../context/note';

const Sidebar = () => {
  const { profile } = useContext(UserContext) as IUserContext;
  const { resetNotes } = useContext(NoteContext) as INoteContext;
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
          <div onClick={resetNotes} className={sidebarStyles.linkContainer}>
            <GrNotes />
            <p>Notes</p>
          </div>
        </Link>
        <Link to="/dashboard/calendar">
          <div className={sidebarStyles.linkContainer}>
            <AiOutlineCalendar />
            <p>Calendar</p>
          </div>
        </Link>
        <Link to="/dashboard/contacts">
          <div className={sidebarStyles.linkContainer}>
            <AiOutlineContacts />
            <p>Contacts</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
