import { Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';

type LogRowProps = {
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export const LogRow = ({ field, value }: LogRowProps) => (
  <x.div display='flex' gap='5px'>
    <Typography color='secondary'><b>{`${field}:`}</b></Typography>
    <Typography>{value}</Typography>
  </x.div>
);
