import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import { CircularProgress, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { Changing } from '@models';
import { getChangings } from '@services';

import { ChangingForm, ChangingLog } from './components';

export const ChangingPage = () => {
  const [changings, setChangings] = useState<Changing[] | undefined>();

  const loadAllChangings = async () => {
    const allChangings = await getChangings();
    setChangings(allChangings);
  };

  useEffect(() => {
    void loadAllChangings();
  }, []);

  const renderChangingLogs = () => {
    if (isNil(changings)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <CircularProgress />
        </x.div>
      );
    }

    if (isEmpty(changings)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <Typography variant='body1'>No Changing Logs To Display</Typography>
          <BabyChangingStationRoundedIcon />
        </x.div>
      );
    }

    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {changings.map((changing, index) => <ChangingLog key={`changing-${index}`} changing={changing} onSuccess={loadAllChangings} />)}
      </x.div>
    );
  }

  return (
    <x.div id='changing-page'>
      <ChangingForm onSuccess={loadAllChangings} />
      <x.div margin='20px 0'>
        <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
          <x.div display='flex' justifyContent='center'>
            <Typography variant='h5'><b>Past Changings</b></Typography>
          </x.div>
          <Divider sx={{ borderColor: 'white' }} />
        </x.div>
        {renderChangingLogs()}
      </x.div>
    </x.div>
  );
};
