import AirlineSeatFlatRoundedIcon from '@mui/icons-material/AirlineSeatFlatRounded';
import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import { x } from '@xstyled/styled-components';
import { ReactNode } from 'react';

import { useGlobal } from '@contexts';
import { WhiteIcon, WhiteIconButtonContainer, WhiteIconText } from '@styles';
import { Page } from '@types';

export const Footer = () => {
  return (
    <x.div alignItems='center' backgroundColor='black' display='flex' id='app-footer' justifyContent='space-between' padding='12px 20px'>
      <IconWithText icon={<HomeRoundedIcon />} page={Page.HOME} text='Home' />
      <IconWithText icon={<LocalDiningRoundedIcon />} page={Page.FEEDING} text='Feeding' />
      <IconWithText icon={<AirlineSeatFlatRoundedIcon />} page={Page.SLEEP} text='Sleep' />
      <IconWithText icon={<BabyChangingStationRoundedIcon />} page={Page.CHANGING} text='Changing' />
      <IconWithText icon={<GrassRoundedIcon />} page={Page.GROWTH} text='Growth' />
    </x.div>
  );
};

const IconWithText = ({ icon, page, text }: { icon: ReactNode; page: Page, text: string }) => {
  const { page: currentPage, setPage } = useGlobal();
  const isActive = currentPage === page;

  return (
    <WhiteIconButtonContainer isActive={isActive} onClick={() => setPage(page)}>
      <WhiteIcon isActive={isActive}>
        {icon}
      </WhiteIcon>
      <WhiteIconText isActive={isActive} variant='body2'>
        {text}
      </WhiteIconText>
    </WhiteIconButtonContainer>
  );
};
