import { useRef, useCallback, useState, useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';
import userMenuStyles from '../../styles/components/dashboard/UserMenu.module.scss';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { UserContext } from '../../context/user';
import { IUserContext } from '../../interfaces';

const UserMenu = () => {
  const navigate = useNavigate();
  const { profile, signOut } = useContext(UserContext) as IUserContext;
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const clickAway = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    const target = e.target as Element;
    if (menuRef.current !== null && triggerRef.current !== null) {
      if (!menuRef.current.contains(target) && target !== triggerRef.current) {
        console.log('close menu');
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
    navigate('/');
  };

  return (
    <div onClick={handleOpenMenu}>
      <div ref={triggerRef} className={userMenuStyles.userIcon}>
        <FaUserCircle />
      </div>
      {menuOpen && (
        <div ref={menuRef} className={userMenuStyles.userMenu}>
          <div className={userMenuStyles.header}>
            <p>{profile?.full_name}</p>
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
