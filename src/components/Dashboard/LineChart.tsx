import lineChartStyles from '../../styles/components/dashboard/LineChart.module.scss';
import supabase from '../../config/supabaseClient';
import { useState, useEffect, useContext } from 'react';
import {
  LineChart as Chart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { UserContext } from '../../context/user';
import { IUserContext, IChartData } from '../../interfaces';
const LineChart = () => {
  const { profile } = useContext(UserContext) as IUserContext;
  const [data, setData] = useState<IChartData[]>([]);

  const fetchChartData = async () => {
    if (!profile) return;
    const { data } = await supabase
      .from<IChartData>('bills')
      .select('company, amount, id, user_id')
      .eq('user_id', profile?.id);
    if (data) {
      setData(data);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchChartData();
    };
    fetch();
  }, [profile?.id]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart
        width={400}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="company" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="amount" stroke="#0080ff" activeDot={{ r: 8 }} />
      </Chart>
    </ResponsiveContainer>
  );
};

export default LineChart;
