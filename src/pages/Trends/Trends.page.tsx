import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { useState } from 'react';

import { Period } from '@types';
import { toCapitalCase } from '@utils';

import { ChangingCharts, FeedingCharts, GrowthCharts, SleepCharts } from './components';

enum TrendType {
  CHANGING = 'Changing',
  FEEDING = 'Feeding',
  GROWTH = 'Growth',
  SLEEP = 'Sleep',
}

export const TrendsPage = () => {
  const [months, setMonths] = useState<number>(1);
  const [period, setPeriod] = useState<Period>(Period.MONTH);
  const [type, setType] = useState<TrendType>(TrendType.FEEDING);
  const [weeks, setWeeks] = useState<number>(1);
  const monthOptions = [1, 3, 6, 12];
  const weekOptions = [1, 2, 3, 4];

  return (
    <x.div display='flex' flexDirection='column' gap='15px 'margin='5px 0'>
      <FormControl fullWidth variant='outlined'>
        <InputLabel id='type-select-label'>Type</InputLabel>
        <Select
          labelId='type-select-label'
          id='type-select'
          value={type}
          label='Type'
          onChange={(event: SelectChangeEvent<TrendType>) => setType(event.target.value as TrendType)}
        >
          {
            Object.values(TrendType).map((it, index) =>
              <MenuItem key={`trend-type-${index}`} value={it}>
                {toCapitalCase(it)}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>
      <FormControl fullWidth variant='outlined'>
        <InputLabel id='period-type-select-label'>Period</InputLabel>
        <Select
          labelId='period-type-select-label'
          id='period-type-select'
          value={period}
          label='Period Type'
          onChange={
            (event: SelectChangeEvent<Period>) => {
              setPeriod(event.target.value as Period);
              setMonths(1);
              setWeeks(1);
            }
          }
        >
          {
            Object.values(Period).map((it, index) =>
              <MenuItem key={`period-type-${index}`} value={it}>
                {toCapitalCase(it)}
              </MenuItem>
            )
          }
        </Select>
      </FormControl>
      {
        period === Period.MONTH &&
        <FormControl fullWidth variant='outlined'>
          <InputLabel id='months-select-label'>Months</InputLabel>
          <Select
            labelId='months-select-label'
            id='months-select'
            value={months}
            label='Month'
            onChange={
              (event: SelectChangeEvent<number>) => {
                setMonths(Number(event.target.value));
                setWeeks(0);
              }
            }
          >
            {
              monthOptions.map((month) => (
                <MenuItem key={month} value={month}>
                  {month} month{month !== 1 ? 's' : ''}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      }
      {
        period === Period.WEEK &&
        <FormControl fullWidth variant='outlined'>
          <InputLabel id='weeks-select-label'>Weeks</InputLabel>
          <Select
            labelId='weeks-select-label'
            id='weeks-select'
            value={weeks}
            label='Week'
            onChange={
              (event: SelectChangeEvent<number>) => {
                setMonths(0);
                setWeeks(Number(event.target.value));
              }
            }
          >
            {
              weekOptions.map((week) => (
                <MenuItem key={week} value={week}>
                  {week} week{week !== 1 ? 's' : ''}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      }
      <TrendCharts months={months} period={period} type={type} weeks={weeks} />
    </x.div>
  );
};

type ChartsProps = {
  months: number;
  period: Period;
  type: TrendType;
  weeks: number;
}

const TrendCharts = ({ months, period, type, weeks }: ChartsProps) => {
  const getCharts = () => {
    const finalPeriod = period === Period.MONTH ? months : weeks;
    const key = `${type}-${period}-${finalPeriod}`;

    switch (type) {
      case TrendType.CHANGING:
        return <ChangingCharts key={key} period={finalPeriod} periodType={period} />;
      case TrendType.FEEDING:
        return <FeedingCharts key={key} period={finalPeriod} periodType={period} />;
      case TrendType.GROWTH:
        return <GrowthCharts key={key} period={finalPeriod} periodType={period} />;
      case TrendType.SLEEP:
        return <SleepCharts key={key} period={finalPeriod} periodType={period} />;
    }
  };

  return getCharts();
};
