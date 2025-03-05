import NoMealsRoundedIcon from '@mui/icons-material/NoMealsRounded';
import { CircularProgress, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { Feeding } from '@models';
import { getFeedings } from '@services';

import { FeedingForm, FeedingLog } from './components';

export const FeedingPage = () => {
  const [feedings, setFeedings] = useState<Feeding[] | undefined>();

  const loadAllFeedings = async () => {
    const allFeedings = await getFeedings();
    setFeedings(allFeedings);
  }

  useEffect(() => {
    void loadAllFeedings();
  }, []);

  const renderFeedingLogs = () => {
    if (isNil(feedings)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <CircularProgress />
        </x.div>
      );
    }

    if (isEmpty(feedings)) {
      return (
        <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
          <Typography variant='body1'>No Feedings To Display</Typography>
          <NoMealsRoundedIcon />
        </x.div>
      );
    }

    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {feedings.map((feeding, index) => <FeedingLog key={`feeding-${index}`} feeding={feeding} onSuccess={loadAllFeedings} />)}
      </x.div>
    );
  }

  return (
    <x.div id='feeding-page'>
      <FeedingForm onSuccess={loadAllFeedings} />
      <x.div margin='20px 0'>
        <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
          <x.div display='flex' justifyContent='center'>
            <Typography variant='h5'><b>Past Feedings</b></Typography>
          </x.div>
          <Divider sx={{ borderColor: 'white' }} />
        </x.div>
        {renderFeedingLogs()}
      </x.div>
    </x.div>
  );
};
