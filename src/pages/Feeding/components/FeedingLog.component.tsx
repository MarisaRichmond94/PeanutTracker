import { Box, Button, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';

import { Feeding, FeedingMethod } from '@models';
import { formatTimestamp } from '@utils';
import { deleteFeeding } from '@services';

interface FeedingLogProps {
  feeding: Feeding;
  onSuccess: () => void;
}

export const FeedingLog = ({ feeding, onSuccess }: FeedingLogProps) => {
  const { id, method } = feeding;

  const onDelete = async () => {
    await deleteFeeding(id);
    await onSuccess();
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
        gap: 2,
      }}
    >
      <Card>
        {method === FeedingMethod.BREAST ? <BreastFeedingLog feeding={feeding} /> : <BottleFeedingLog feeding={feeding} />}
        <CardActions sx={{ justifyContent: 'right' }}>
          {/* <Button color='primary' variant='contained'>Edit</Button> */}
          <Button color='error' onClick={onDelete} variant='outlined'>Delete</Button>
        </CardActions>
      </Card>
    </Box>
  );
};

const BreastFeedingLog = ({ feeding: breastFeeding }: Omit<FeedingLogProps, 'onSuccess'>) => {
  const { duration, notes, side, timestamp } = breastFeeding;

  return (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'><b>Breast Feeding</b></Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <LogRow field='Date' value={formatTimestamp(timestamp)} />
      <LogRow field='Duration' value={duration} />
      <LogRow field='Side' value={side} />
      <LogRow field='Notes' value={notes} />
    </CardContent>
  );
};

const BottleFeedingLog = ({ feeding: bottleFeeding }: Omit<FeedingLogProps, 'onSuccess'>) => {
  const { amount, notes, timestamp } = bottleFeeding;

  return (
    <CardContent>
      <x.div display='flex' justifyContent='center'>
        <Typography variant='h6'><b>Bottle Feeding</b></Typography>
      </x.div>
      <Divider sx={{ borderColor: 'white', my: 1 }} />
      <LogRow field='Date' value={formatTimestamp(timestamp)} />
      <LogRow field='Amount' value={amount} />
      <LogRow field='Notes' value={notes} />
    </CardContent>
  );
};

type LogRowProps = {
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

const LogRow = ({ field, value }: LogRowProps) => (
  <x.div display='flex' gap='5px'>
    <Typography color='secondary'><b>{`${field}:`}</b></Typography>
    <Typography>{value}</Typography>
  </x.div>
);
