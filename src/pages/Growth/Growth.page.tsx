import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import { Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { Growth } from '@models';
import { getGrowths } from '@services';

import { GrowthForm, GrowthLog } from './components';

export const GrowthPage = () => {
  const [growths, setGrowths] = useState<Growth[] | undefined>();

  const loadAllGrowths = async () => {
    const allGrowths = await getGrowths();
    setGrowths(allGrowths);
  };

  useEffect(() => { void loadAllGrowths(); }, []);

  const renderGrowthLogs = () => {
    if (isNil(growths)) return <LoadingState />;
    if (isEmpty(growths)) return <EmptyState icon={<GrassRoundedIcon />} type='Growth' />;
    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {growths.map((growth, index) => <GrowthLog key={`growth-${index}`} growth={growth} onSuccess={loadAllGrowths} />)}
      </x.div>
    );
  };

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
