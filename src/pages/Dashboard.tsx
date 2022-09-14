import dashboardStyles from '../styles/pages/Dashboard.module.scss';
import Sidebar from '../components/Dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { ChangeEvent, useContext } from 'react';
import { BackgroundContext } from '../context/background';
import { IBackgroundContext, IUserContext } from '../interfaces';
import { UserContext } from '../context/user';
import { useEffectOnce } from '../hooks/UseEffectOnce';
const Dashboard = () => {
  const { background, getBackground, uploadBackground } = useContext(
    BackgroundContext
  ) as IBackgroundContext;
  const { session, profile } = useContext(UserContext) as IUserContext;
  useEffectOnce(() => {
    const session = localStorage.getItem('supabase.auth.token');
    if (session) {
      const user = JSON.parse(session ?? '').currentSession.user;
      getBackground(user.id);
    }
  });

  const handleBackgroundChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file: File = e.target.files[0];

    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    const filePath = `${session?.user?.id}/${secondsSinceEpoch}-${file.name}`;
    if (profile !== null) {
      await uploadBackground(file, filePath, profile.id);
    }
  };
  return (
    <div
      style={{
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: `url(${background?.background_url})`,
      }}
      className={dashboardStyles.container}
    >
      <div className={dashboardStyles.backgroundChanger}>
        <AiOutlinePlus />
        <p>Change Background</p>
        <input onChange={handleBackgroundChange} type="file" accept="image/*" />
      </div>

      <div className={dashboardStyles.dashboardContainer}>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
