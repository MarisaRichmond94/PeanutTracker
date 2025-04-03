import NoMealsRoundedIcon from '@mui/icons-material/NoMealsRounded';
import { Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { getBottleFeedings, getBreastFeedings, getFeedings } from '@services';
import { FeedingEntity } from '@types';

import { FeedingForm, FeedingLog } from './components';
import { BottleFeeding, BreastFeeding, Feeding } from '@models';

export const FeedingPage = () => {
  const [bottleFeedings, setBottleFeedings] = useState<BottleFeeding[] | undefined>();
  const [breastFeedings, setBreastFeedings] = useState<BreastFeeding[] | undefined>();
  const [feedings, setFeedings] = useState<Feeding[] | undefined>();

  const loadAllFeedings = async () => {
    const allBottleFeedings = await getBottleFeedings();
    const allBreastFeedings = await getBreastFeedings();
    const allFeedings = await getFeedings();
    setBottleFeedings(allBottleFeedings);
    setBreastFeedings(allBreastFeedings);
    setFeedings(allFeedings);
  };

  const getCombinedFeedings = (): FeedingEntity[] => {
    const allFeedings = [
      ...(bottleFeedings || []),
      ...(breastFeedings || []),
      ...(feedings || []),
    ] as FeedingEntity[];
    allFeedings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allFeedings;
  };

  useEffect(() => { void loadAllFeedings(); }, []);

  const renderFeedingLogs = () => {
    const combinedFeedings = getCombinedFeedings();
    if (isNil(combinedFeedings)) return <LoadingState />;
    if (isEmpty(combinedFeedings)) return <EmptyState icon={<NoMealsRoundedIcon />} type='Feeding' />;
    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {combinedFeedings.map((feeding, index) => <FeedingLog key={`feeding-${index}`} feeding={feeding} onSuccess={loadAllFeedings} />)}
      </x.div>
    );
  };

  return (
    <x.div id='feeding-page'>
      <FeedingForm onSuccess={loadAllFeedings} />
      <x.div margin='20px 0'>
        <x.div display='flex' flexDirection='column' gap='10px' marginBottom='15px'>
          <x.div display='flex' justifyContent='center'>
            <Typography variant='h5'><b>Feeding Logs</b></Typography>
          </x.div>
          <Divider sx={{ borderColor: 'white' }} />
        </x.div>
        {renderFeedingLogs()}
      </x.div>
    </x.div>
  );
};
