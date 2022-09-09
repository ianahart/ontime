import { useContext } from 'react';
import { UserContext } from '../../context/user';
import { IUserContext } from '../../interfaces';
import UserMenu from '../Dashboard/UserMenu';
const Navbar = () => {
  const { profile } = useContext(UserContext) as IUserContext;
  return <div>{profile?.id && <UserMenu />}</div>;
};

export default Navbar;
