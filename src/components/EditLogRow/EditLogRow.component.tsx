import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { ReactNode } from 'react';

type EditLogRowProps = {
  field: string;
  value: ReactNode;
}

export const EditLogRow = ({ field, value }: EditLogRowProps) => (
  <x.div display='flex' gap='5px'>
    <Typography color='secondary'><b>{`${field}:`}</b></Typography>
    {value}
  </x.div>
);
