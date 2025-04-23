import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getBottleFeedingsInRange, getBreastFeedingsInRange, getPumpingsInRange } from '@services';
import { BottleFeeding, BreastFeeding, Pumping } from '@models';

type BottleFeedingEntry = {
  date: string;
  supplementCount: number;
  ouncesSupplemented: number;
}

type BreastFeedingEntry = {
  date: string;
  duration: number;
  breastFeedingCount: number;
}

type PumpingEntry = {
  date: string;
  duration: number;
  pumpingCount: number;
  ouncesPumped: number;
}

export const FeedingCharts = ({ months }: { months: number }) => {
  const [bottleFeedingData, setBottleFeedingData] = useState<BottleFeedingEntry[]>([]);
  const [breastFeedingData, setBreastFeedingData] = useState<BreastFeedingEntry[]>([]);
  const [pumpingData, setPumpingData] = useState<PumpingEntry[]>([]);

  const getDataOverNMonths = async () => {
    const start = dayjs().subtract(months, 'month').startOf('day').toISOString();
    const end = dayjs().endOf('day').toISOString();

    const bottleFeedingsInRange = await getBottleFeedingsInRange(start, end);
    setBottleFeedingData(convertToBottleFeedingEntries(bottleFeedingsInRange));

    const breastFeedingsInRange = await getBreastFeedingsInRange(start, end);
    setBreastFeedingData(convertToBreastFeedingEntries(breastFeedingsInRange));

    const pumpingsInRange = await getPumpingsInRange(start, end);
    setPumpingData(convertToPumpingEntries(pumpingsInRange));
  };

  const convertToBottleFeedingEntries = (feedings: BottleFeeding[]): BottleFeedingEntry[] => {
    const summaryMap = new Map<string, { ouncesSupplemented: number, supplementCount: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('YYYY-MM-DD');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { ouncesSupplemented: 0, supplementCount: 0 });
      }

      const current = summaryMap.get(date)!;
      current.ouncesSupplemented += feeding.amount;
      current.supplementCount += 1;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { ouncesSupplemented, supplementCount }]) => ({
        date,
        ouncesSupplemented,
        supplementCount,
      })
    );
  };

  const convertToBreastFeedingEntries = (feedings: BreastFeeding[]): BreastFeedingEntry[] => {
    const summaryMap = new Map<string, { duration: number, breastFeedingCount: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('YYYY-MM-DD');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { duration: feeding.duration, breastFeedingCount: 0 });
      }

      const current = summaryMap.get(date)!;
      current.duration += feeding.duration;
      current.breastFeedingCount += 1;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { duration, breastFeedingCount }]) => ({
        date,
        duration,
        breastFeedingCount,
      })
    );
  };

  const convertToPumpingEntries = (feedings: Pumping[]): PumpingEntry[] => {
    const summaryMap = new Map<string, { duration: number, ouncesPumped: number, pumpingCount: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('YYYY-MM-DD');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { duration: feeding.duration, ouncesPumped: 0, pumpingCount: 0 });
      }

      const current = summaryMap.get(date)!;
      current.duration += feeding.duration;
      current.ouncesPumped += (feeding.leftAmount + feeding.rightAmount);
      current.pumpingCount += 1;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { duration, ouncesPumped, pumpingCount }]) => ({
        date,
        duration,
        ouncesPumped,
        pumpingCount,
      })
    );
  };

  useEffect(() => {
    void getDataOverNMonths();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <x.div display='flex' flexDirection='column' gap='15px'>
      <Typography>Breast Feeding Trends (In Minutes)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={breastFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'minutes (total)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' data='duration' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Breast Feeding Trends (Times Per Day)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={breastFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'times', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='breastFeedingCount' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Pumping Trends (In Minutes)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={pumpingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'minutes (total)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='duration' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Pumping Trends (Times Per Day)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={pumpingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'times', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='pumpingCount' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Pumping Trends (Ounces Per Day)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={pumpingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'ounce(s) per day', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='ouncesPumped' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Bottle Feeding Trends (Times Per Day)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={bottleFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'times', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' data='supplementCount' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
      <Typography>Bottle Feeding Trends (Ounces Per Day)</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={bottleFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'ounce(s) per day', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='ouncesSupplemented' stroke='#8884d8' strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </x.div>
  );
};
