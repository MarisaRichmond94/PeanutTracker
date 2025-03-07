import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { CircularProgress, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { Growth } from '@models';
import { getGrowths } from '@services';

import { GrowthForm, GrowthLog } from './components';

export const GrowthPage = () => {
  const [growths, setGrowths] = useState<Growth[] | undefined>();

  const loadAllGrowths = async () => {
    const allGrowths = await getGrowths();
    setGrowths(allGrowths);
  };

  useEffect(() => {
    void loadAllGrowths();
  }, []);

  const renderGrowthLogs = () => {
    if (isNil(growths)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <CircularProgress />
        </x.div>
      );
    }

    if (isEmpty(growths)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <Typography variant='body1'>No Growth Logs To Display</Typography>
          <GrassRoundedIcon />
        </x.div>
      );
    }

    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {growths.map((growth, index) => <GrowthLog key={`growth-${index}`} growth={growth} onSuccess={loadAllGrowths} />)}
      </x.div>
    );
  }

  return (
    <x.div id='growth-page'>
      <GrowthForm onSuccess={loadAllGrowths} />
      <x.div margin='20px 0'>
        <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
          <x.div display='flex' justifyContent='center'>
            <Typography variant='h5'><b>Past Growth Logs</b></Typography>
          </x.div>
          <Divider sx={{ borderColor: 'white' }} />
        </x.div>
        {renderGrowthLogs()}
      </x.div>
    </x.div>
  );
};
