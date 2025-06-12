import { Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { BottleFeeding, BreastFeeding, Pumping } from '@models';
import { getBottleFeedingsInRange, getBreastFeedingsInRange, getPumpingsInRange } from '@services';
import { Period } from '@types';

type BottleFeedingEntry = {
  date: string;
  count: number;
  ounces: number;
}

type BreastFeedingEntry = {
  date: string;
  duration: number;
  count: number;
}

type PumpingEntry = {
  date: string;
  duration: number;
  count: number;
  ounces: number;
}

type OuncesEntity = {
  date: string;
  supplemented?: number;
  pumped?: number;
}

export const FeedingCharts = ({ period, periodType }: { period: number, periodType: Period }) => {
  const [bottleFeedingData, setBottleFeedingData] = useState<BottleFeedingEntry[]>([]);
  const [breastFeedingData, setBreastFeedingData] = useState<BreastFeedingEntry[]>([]);
  const [pumpingData, setPumpingData] = useState<PumpingEntry[]>([]);

  const getDataOverNMonths = async () => {
    const start = dayjs().subtract(period, periodType).startOf('day').toISOString();
    const end = dayjs().endOf('day').toISOString();

    const bottleFeedingsInRange = await getBottleFeedingsInRange(start, end);
    setBottleFeedingData(convertToBottleFeedingEntries(bottleFeedingsInRange));

    const breastFeedingsInRange = await getBreastFeedingsInRange(start, end);
    setBreastFeedingData(convertToBreastFeedingEntries(breastFeedingsInRange));

    const pumpingsInRange = await getPumpingsInRange(start, end);
    setPumpingData(convertToPumpingEntries(pumpingsInRange));
  };

  const convertToBottleFeedingEntries = (feedings: BottleFeeding[]): BottleFeedingEntry[] => {
    const summaryMap = new Map<string, { ounces: number, count: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('M/D');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { ounces: 0, count: 0 });
      }

      const current = summaryMap.get(date)!;
      current.ounces += feeding.amount;
      current.count += 1;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { ounces, count }]) => ({
        date,
        ounces,
        count,
      })
    );
  };

  const convertToBreastFeedingEntries = (feedings: BreastFeeding[]): BreastFeedingEntry[] => {
    const summaryMap = new Map<string, { duration: number, count: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('M/D');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { duration: feeding.duration, count: 0 });
      }

      const current = summaryMap.get(date)!;
      current.duration += feeding.duration;
      current.count += 1;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { duration, count }]) => ({
        date,
        duration,
        count,
      })
    );
  };

  const convertToPumpingEntries = (feedings: Pumping[]): PumpingEntry[] => {
    const summaryMap = new Map<string, { duration: number, ounces: number, count: number }>();

    for (const feeding of feedings) {
      const date = dayjs(feeding.timestamp).format('M/D');

      if (!summaryMap.has(date)) {
        summaryMap.set(date, { duration: feeding.duration, ounces: 0, count: 0 });
      }

      const current = summaryMap.get(date)!;
      current.duration += feeding.duration;
      current.ounces += (feeding.leftAmount + feeding.rightAmount);
      current.count += 1;
    };

    return Array.from(summaryMap.entries()).map(
      ([date, { duration, ounces, count }]) => ({
        date,
        duration,
        ounces,
        count,
      })
    );
  };

  const convertToPumpingVersusSupplementEntries = (pumped: PumpingEntry[], supplemented: BottleFeedingEntry[]): OuncesEntity[] => {
    const map = new Map<string, OuncesEntity>()

    for (const { date, ounces } of supplemented) {
      if (!map.has(date)) map.set(date, { date })
      map.get(date)!.supplemented = ounces
    }

    for (const { date, ounces } of pumped) {
      if (!map.has(date)) map.set(date, { date })
      map.get(date)!.pumped = ounces
    }

    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
  };

  useEffect(() => {
    void getDataOverNMonths();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SupplementVsPumpedChart = (
    <ResponsiveContainer width='100%' height={300}>
      <LineChart data={convertToPumpingVersusSupplementEntries(pumpingData, bottleFeedingData)} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis label={{ value: 'Ounces', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Line type='monotone' dataKey='supplemented' stroke='#8884d8' name='supplemented' />
        <Line type='monotone' dataKey='pumped' stroke='#82ca9d' name='pumped' />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <x.div display='flex' flexDirection='column' gap='15px'>
      <Typography>Breast Feeding Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={breastFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'mins breast fed', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='duration' stroke='#8884d8' strokeWidth={2} dot unit=' mins' />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={breastFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'times', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='count' stroke='#8884d8' strokeWidth={2} dot unit=' daily feedings' />
        </LineChart>
      </ResponsiveContainer>
      <Divider sx={{ borderColor: 'white' }} />
      <Typography>Pumping Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={pumpingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'mins pumped', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='duration' stroke='#8884d8' strokeWidth={2} dot unit=' mins' />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={pumpingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'daily pumps', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='count' stroke='#8884d8' strokeWidth={2} dot unit=' pumps' />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={pumpingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'oz(s) pumped', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='ounces' stroke='#8884d8' strokeWidth={2} dot unit=' oz(s)' />
        </LineChart>
      </ResponsiveContainer>
      <Divider sx={{ borderColor: 'white' }} />
      <Typography>Bottle Feeding Trends</Typography>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={bottleFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'supplement count', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='count' stroke='#8884d8' strokeWidth={2} dot unit=' bottles supplemented' />
        </LineChart>
      </ResponsiveContainer>
      <ResponsiveContainer width='100%' height={300}>
        <LineChart data={bottleFeedingData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis label={{ value: 'oz supplemented', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type='monotone' dataKey='ounces' stroke='#8884d8' strokeWidth={2} dot unit='oz' />
        </LineChart>
      </ResponsiveContainer>
      <Divider sx={{ borderColor: 'white' }} />
      <Typography>Combined Trends</Typography>
      {SupplementVsPumpedChart}
    </x.div>
  );
};
