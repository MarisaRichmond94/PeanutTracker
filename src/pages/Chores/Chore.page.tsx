import CleaningServicesIcon from '@mui/icons-material/CleaningServices';import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import { Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { Chore } from '@models';
import { getChores } from '@services';

import { ChoreForm, ChoreLog } from './components';

export const ChorePage = () => {
  const [chores, setChores] = useState<Chore[] | undefined>();

  const loadAllChores = async () => {
    const allChores = await getChores();
    setChores(allChores);
  };

  useEffect(() => { void loadAllChores(); }, []);

  const renderChoreLogs = () => {
    if (isNil(chores)) return <LoadingState />;
    if (isEmpty(chores)) return <EmptyState icon={<CleaningServicesIcon />} type='Chore' />;
    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {chores.map((chore, index) => <ChoreLog key={`chore-${index}`} chore={chore} onSuccess={loadAllChores} />)}
      </x.div>
    );
  };

  return (
    <x.div id='sleep-page'>
      <ChoreForm onSuccess={loadAllChores} />
      <x.div margin='20px 0'>
        <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
          <x.div display='flex' justifyContent='center'>
            <Typography variant='h5'><b>Chore Logs</b></Typography>
          </x.div>
          <Divider sx={{ borderColor: 'white' }} />
        </x.div>
        {renderChoreLogs()}
      </x.div>
    </x.div>
  );
};
