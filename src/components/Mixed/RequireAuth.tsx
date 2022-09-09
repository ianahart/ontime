import { useLocation, Navigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
interface Props {
  children: JSX.Element;
}

const RequireAuth: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const session = supabase.auth.session();

  if (session?.user !== null && session?.user !== undefined) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireAuth;
