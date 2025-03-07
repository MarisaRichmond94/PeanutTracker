import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ReactNode } from 'react';

type EmptyStateProps = {
  icon: ReactNode;
  type: string;
}

export const EmptyState = ({ icon, type }: EmptyStateProps) => (
  <x.div alignItems='center' display='flex' flexDirection='column' gap='10px' margin='10vh 0'>
    <Typography variant='body1'>{`No ${type} Logs To Display`}</Typography>
    {icon}
  </x.div>
);
