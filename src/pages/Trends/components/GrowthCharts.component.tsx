import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Growth } from '@models';
import { getGrowthsInRange } from '@services';
import { Period } from '@types';

type GrowthEntry = {
  date: string;
  weight?: number;
  height?: number;
}

export const GrowthCharts = ({ period, periodType }: { period: number, periodType: Period }) => {
  const [data, setData] = useState<GrowthEntry[]>([]);

  const getGrowthOverNMonths = async () => {
    const growthsInRange = await getGrowthsInRange(
      dayjs().subtract(period, periodType).startOf('day').toISOString(),
      dayjs().endOf('day').toISOString(),
    );
    setData(convertToGrowthEntries(growthsInRange));
  };

  const convertToGrowthEntries = (growthData: Growth[]): GrowthEntry[] => growthData
    .filter((entry) => entry.timestamp)
    .map((entry) => ({
      date: dayjs(entry.timestamp).format('YYYY-MM-DD'),
      ...(entry.weight !== null && { weight: entry.weight }),
      ...(entry.height !== null && { height: entry.height }),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  useEffect(() => {
    void getGrowthOverNMonths();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <x.div display='flex' flexDirection='column' gap='15px'>
      <Typography>Weight Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'lbs', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='weight' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Height Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'lbs', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='height' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </x.div>
  );
};
