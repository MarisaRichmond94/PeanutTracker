import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getBreastFeedingsInRange } from '@services';
import { BreastFeeding } from '@models';

type FeedingEntry = {
  date: string;
  duration: number;
}

export const FeedingCharts = ({ months }: { months: number }) => {
  const [data, setData] = useState<FeedingEntry[]>([]);

  const getGrowthOverNMonths = async () => {
    const feedingsInRange = await getBreastFeedingsInRange(
      dayjs().subtract(months, 'month').startOf('day').toISOString(),
      dayjs().endOf('day').toISOString(),
    );
    setData(convertToFeedingEntries(feedingsInRange));
  };

  const convertToFeedingEntries = (feedings: BreastFeeding[]): FeedingEntry[] => {
    const summaryMap = new Map<string, { duration: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('YYYY-MM-DD');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { duration: feeding.duration });
      }

      const current = summaryMap.get(date)!;
      current.duration += feeding.duration;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { duration }]) => ({
        date,
        duration,
      })
    );
  };

  useEffect(() => {
    void getGrowthOverNMonths();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <x.div display='flex' flexDirection='column' gap='15px'>
      <Typography>Feeding Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'minutes (total)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='duration' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </x.div>
  );
};
