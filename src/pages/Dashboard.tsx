import dashboardStyles from '../styles/pages/Dashboard.module.scss';
import UserMenu from '../components/Dashboard/UserMenu';
import Sidebar from '../components/Dashboard/Sidebar';
import Bills from '../components/Dashboard/Bills';
import { Outlet } from 'react-router-dom';
const Dashboard = () => {
  return (
    <div className={dashboardStyles.container}>
      <div className={dashboardStyles.dashboardContainer}>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
