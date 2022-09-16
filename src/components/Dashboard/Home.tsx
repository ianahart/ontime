import homeStyles from '../../styles/components/dashboard/Home.module.scss';
import LineChart from './LineChart';
const Home = () => {
  return (
    <div className={homeStyles.container}>
      <LineChart />
    </div>
  );
};

export default Home;
