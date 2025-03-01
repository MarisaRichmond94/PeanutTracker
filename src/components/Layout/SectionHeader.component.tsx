import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Divider, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';

import { WhiteIconButton } from '@styles';

type SectionHeaderProps = {
  text: string;
  onClick: () => void;
}

export const SectionHeader = ({ text, onClick }: SectionHeaderProps) => (
  <x.div display='flex' flexDirection='column'>
    <x.div alignItems='center' display='flex' position='relative'>
      <WhiteIconButton onClick={onClick}>
        <ArrowBackRoundedIcon />
      </WhiteIconButton>
      <x.div left='50%' position='absolute' transform='translateX(-50%)'>
        <Typography variant='h6'>
          {text}
        </Typography>
      </x.div>
    </x.div>
    <Divider sx={{ borderColor: 'white', mt: 2 }} />
  </x.div>
);