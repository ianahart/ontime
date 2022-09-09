import { useLocation, Navigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';

interface Props {
  children: JSX.Element;
}

const RequireGuest: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const guestRoutes = ['/sign-up', '/'];

  const session = supabase.auth.session();

  if (
    session?.user === null ||
    (session?.user === undefined && guestRoutes.includes(location.pathname))
  ) {
    return children;
  } else {
    return <Navigate to="/dashboard" replace state={{ path: location.pathname }} />;
  }
};

export default RequireGuest;
