import MenuIcon from '@mui/icons-material/Menu';
import { x } from '@xstyled/styled-components';

import { useGlobal } from '@contexts';
import * as S from '@styles';
import { Page } from '@types';

type HeaderProps = {
  showHeaderMenu: boolean;
  setShowHeaderMenu: (showHeaderMenu: boolean) => void;
}

export const Header = ({ showHeaderMenu, setShowHeaderMenu }: HeaderProps) => {
  const { setPage } = useGlobal();

  return (
    <S.LayoutComponentContainer id='app-header'>
      <x.img onClick={() => setPage(Page.HOME)} src='/assets/header_logo.png' alt='Landing Logo' w='50vw' />
      <S.WhiteIconButton onClick={() => setShowHeaderMenu(!showHeaderMenu)} size='large'>
        <MenuIcon />
      </S.WhiteIconButton>
    </S.LayoutComponentContainer>
  );
};
