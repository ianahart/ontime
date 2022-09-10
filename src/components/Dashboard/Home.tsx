import homeStyles from '../../styles/components/dashboard/Home.module.scss';
const Home = () => {
  return (
    <div className={homeStyles.container}>
      <header>
        <h3>Start tracking your bills here</h3>
        <p>Go to Bills to start</p>
      </header>
    </div>
  );
};

export default Home;
