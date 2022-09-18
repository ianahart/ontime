import { useRef, useCallback, useState, useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { MdLogout } from 'react-icons/md';
import userMenuStyles from '../../styles/components/dashboard/UserMenu.module.scss';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { UserContext } from '../../context/user';
import {
  IBackgroundContext,
  IBillContext,
  IContactContext,
  IUserContext,
} from '../../interfaces';
import { BillContext } from '../../context/bill';
import { backgroundState } from '../../data/initialState';
import { BackgroundContext } from '../../context/background';
import { AiOutlineUser } from 'react-icons/ai';
import { ContactContext } from '../../context/contact';

const UserMenu = () => {
  const navigate = useNavigate();
  const { resetContacts } = useContext(ContactContext) as IContactContext;
  const { profile, signOut } = useContext(UserContext) as IUserContext;
  const { resetBills } = useContext(BillContext) as IBillContext;
  const { resetBackground } = useContext(BackgroundContext) as IBackgroundContext;
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const clickAway = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as Element;
    if (menuRef.current !== null && triggerRef.current !== null) {
      if (!menuRef.current.contains(target) && target !== triggerRef.current) {
        setMenuOpen(false);
      }
    }
  }, []);

  useEffectOnce(() => {
    window.addEventListener('click', clickAway);
    return () => window.addEventListener('click', clickAway);
  });

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleOnSignOut = async () => {
    await signOut();
    resetBills();
    resetContacts();
    resetBackground();
    navigate('/');
  };

  return (
    <div onClick={handleOpenMenu}>
      <div ref={triggerRef} className={userMenuStyles.userIcon}>
        {profile?.avatar_url ? (
          <img
            className={userMenuStyles.profilePicture}
            src={profile?.avatar_url}
            alt="profile image"
          />
        ) : (
          <FaUserCircle />
        )}
      </div>
      {menuOpen && (
        <div ref={menuRef} className={userMenuStyles.userMenu}>
          <div className={userMenuStyles.header}>
            <p>{profile?.full_name}</p>
          </div>

          <div className={userMenuStyles.settings}>
            <AiOutlineUser />
            <Link to="/profile">Profile</Link>
          </div>

          <div className={userMenuStyles.settings}>
            <FiSettings />
            <Link to="/settings">Settings</Link>
          </div>

          <div onClick={handleOnSignOut} className={userMenuStyles.logout}>
            <MdLogout />
            <p role="button">Sign out</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
