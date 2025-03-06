import BedtimeOffRoundedIcon from '@mui/icons-material/BedtimeOffRounded';
import { CircularProgress, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { Sleep } from '@models';
import { getSleeps } from '@services';

import { SleepForm, SleepLog } from './components';

export const SleepPage = () => {
  const [sleeps, setSleeps] = useState<Sleep[] | undefined>();

  const loadAllSleeps = async () => {
    const allSleeps = await getSleeps();
    setSleeps(allSleeps);
  }

  useEffect(() => {
    void loadAllSleeps();
  }, []);

  const renderSleepLogs = () => {
    if (isNil(sleeps)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <CircularProgress />
        </x.div>
      );
    }

    if (isEmpty(sleeps)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <Typography variant='body1'>No Sleep Logs To Display</Typography>
          <BedtimeOffRoundedIcon />
        </x.div>
      );
    }

    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {sleeps.map((sleep, index) => <SleepLog key={`sleep-${index}`} sleep={sleep} onSuccess={loadAllSleeps} />)}
      </x.div>
    );
  }

  return (
    <x.div id='sleep-page'>
      <SleepForm onSuccess={loadAllSleeps} />
      <x.div margin='20px 0'>
        <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
          <x.div display='flex' justifyContent='center'>
            <Typography variant='h5'><b>Past Sleep Logs</b></Typography>
          </x.div>
          <Divider sx={{ borderColor: 'white' }} />
        </x.div>
        {renderSleepLogs()}
      </x.div>
    </x.div>
  );
};
