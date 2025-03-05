import AirlineSeatFlatRoundedIcon from '@mui/icons-material/AirlineSeatFlatRounded';
import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import { ReactNode } from 'react';

import { useGlobal } from '@contexts';
import * as S from '@styles';
import { Page } from '@types';

export const Footer = () => {
  return (
    <S.LayoutComponentContainer id='app-footer'>
      <IconWithText icon={<HomeRoundedIcon />} page={Page.HOME} text='Home' />
      <IconWithText icon={<LocalDiningRoundedIcon />} page={Page.FEEDING} text='Feeding' />
      <IconWithText icon={<AirlineSeatFlatRoundedIcon />} page={Page.SLEEP} text='Sleep' />
      <IconWithText icon={<BabyChangingStationRoundedIcon />} page={Page.CHANGING} text='Changing' />
      <IconWithText icon={<GrassRoundedIcon />} page={Page.GROWTH} text='Growth' />
    </S.LayoutComponentContainer>
  );
};

const IconWithText = ({ icon, page, text }: { icon: ReactNode; page: Page, text: string }) => {
  const { page: currentPage, setPage } = useGlobal();
  const isActive = currentPage === page;

  return (
    <S.WhiteIconButtonContainer isActive={isActive} onClick={() => setPage(page)}>
      <S.WhiteIcon isActive={isActive}>
        {icon}
      </S.WhiteIcon>
      <S.WhiteIconText isActive={isActive} variant='body2'>
        {text}
      </S.WhiteIconText>
    </S.WhiteIconButtonContainer>
  );
};
