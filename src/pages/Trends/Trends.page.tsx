import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { useState } from 'react';

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
  const [type, setType] = useState<TrendType>(TrendType.FEEDING);
  const monthOptions = [1, 3, 6, 12];

  const getCharts = () => {
    switch (type) {
      case TrendType.CHANGING:
        return <ChangingCharts months={months} />;
      case TrendType.FEEDING:
        return <FeedingCharts months={months} />;
      case TrendType.GROWTH:
        return <GrowthCharts months={months} />;
      case TrendType.SLEEP:
        return <SleepCharts months={months} />;
    }
  };

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
        <InputLabel id='months-select-label'>Months</InputLabel>
        <Select
          labelId='months-select-label'
          id='months-select'
          value={months}
          label='Month'
          onChange={(event: SelectChangeEvent<number>) => setMonths(Number(event.target.value))}
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
      {getCharts()}
    </x.div>
  );
};
