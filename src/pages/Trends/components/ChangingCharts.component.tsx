import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Changing, WasteType } from '@models';
import { getChangingsInRange } from '@services';
import { Period } from '@types';

type ChangingEntry = {
  date: string;
  dirtyCount: number;
  wetCount: number;
}

export const ChangingCharts = ({ period, periodType }: { period: number, periodType: Period }) => {
  const [data, setData] = useState<ChangingEntry[]>([]);

  const getChangingsOverNMonths = async () => {
    const changingsInRange = await getChangingsInRange(
      dayjs().subtract(period, periodType).startOf('day').toISOString(),
      dayjs().endOf('day').toISOString(),
    );
    setData(convertToChangingEntries(changingsInRange));
  };

  const convertToChangingEntries = (changings: Changing[]): ChangingEntry[] => {
    const summaryMap = new Map<string, { wetCount: number; dirtyCount: number }>();

    for (const change of changings) {
      const date = dayjs(change.timestamp).format('YYYY-MM-DD');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { wetCount: 0, dirtyCount: 0 });
      }

      const current = summaryMap.get(date)!;

      switch (change.type) {
        case WasteType.WET:
          current.wetCount += 1;
          break;
        case WasteType.DIRTY:
          current.dirtyCount += 1;
          break;
        case WasteType.BOTH:
          current.wetCount += 1;
          current.dirtyCount += 1;
          break;
      }
    }

    return Array.from(summaryMap.entries()).map(
      ([date, { dirtyCount, wetCount }]) => ({ date, dirtyCount, wetCount })
    );
  };

  useEffect(() => {
    void getChangingsOverNMonths();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <x.div display='flex' flexDirection='column' gap='15px'>
      <Typography>Dirty Diaper Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'total', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='dirtyCount' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Wet Diaper Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'total', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='wetCount' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </x.div>
  );
};
