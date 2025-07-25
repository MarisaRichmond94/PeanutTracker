import NoMealsRoundedIcon from '@mui/icons-material/NoMealsRounded';
import { Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { BottleFeeding, BreastFeeding, Feeding, Pumping } from '@models';
import { getBottleFeedingsInRange, getBreastFeedingsInRange, getFeedingsInRange, getPumpingsInRange } from '@services';
import { FeedingEntity, Period } from '@types';

import { FeedingForm, FeedingLog } from './components';

export const FeedingPage = () => {
  const [bottleFeedings, setBottleFeedings] = useState<BottleFeeding[] | undefined>();
  const [breastFeedings, setBreastFeedings] = useState<BreastFeeding[] | undefined>();
  const [feedings, setFeedings] = useState<Feeding[] | undefined>();
  const [pumpings, setPumpings] = useState<Pumping[] | undefined>();

  const getDataOverNMonths = async () => {
    const start = dayjs().subtract(2, Period.WEEK).startOf('day').toISOString();
    const end = dayjs().endOf('day').toISOString();
    const bottleFeedingsInRange = await getBottleFeedingsInRange(start, end);
    const breastFeedingsInRange = await getBreastFeedingsInRange(start, end);
    const pumpingsInRange = await getPumpingsInRange(start, end);
    const allFeedingsInRange = await getFeedingsInRange(start, end);
    setBottleFeedings(bottleFeedingsInRange);
    setBreastFeedings(breastFeedingsInRange);
    setFeedings(allFeedingsInRange);
    setPumpings(pumpingsInRange);
  };

  const getCombinedFeedings = (): FeedingEntity[] => {
    const allFeedings = [
      ...(bottleFeedings || []),
      ...(breastFeedings || []),
      ...(feedings || []),
      ...(pumpings || []),
    ] as FeedingEntity[];
    allFeedings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allFeedings;
  };

  useEffect(() => { void getDataOverNMonths(); }, []);

  const renderFeedingLogs = () => {
    const combinedFeedings = getCombinedFeedings();
    if (isNil(combinedFeedings)) return <LoadingState />;
    if (isEmpty(combinedFeedings)) return <EmptyState icon={<NoMealsRoundedIcon />} type='Feeding' />;
    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {combinedFeedings.map((feeding, index) => <FeedingLog key={`feeding-${index}`} feeding={feeding} onSuccess={getDataOverNMonths} />)}
      </x.div>
    );
  };

  return (
    <x.div id='feeding-page'>
      <FeedingForm onSuccess={getDataOverNMonths} />
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
