import dashboardStyles from '../styles/pages/Dashboard.module.scss';
import UserMenu from '../components/Dashboard/UserMenu';
const Dashboard = () => {
  return (
    <div className={dashboardStyles.container}>
      <div className={dashboardStyles.userMenuContainer}>
        <UserMenu />
      </div>
    </div>
  );
};

export default Dashboard;
