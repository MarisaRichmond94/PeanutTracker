import { CircularProgress } from '@mui/material';
import { x } from '@xstyled/styled-components';

export const LoadingState = () => (
  <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
    <CircularProgress />
  </x.div>
);
