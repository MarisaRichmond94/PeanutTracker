import MenuIcon from '@mui/icons-material/Menu';
import { x } from '@xstyled/styled-components';

import { WhiteIconButton } from '@styles';

export const Header = () => {
  return (
    <x.div alignItems='center' backgroundColor='black' display='flex' id='app-header' justifyContent='space-between' padding='12px 20px'>
      <x.img src='/assets/header_logo.png' alt='Landing Logo' w='50vw' />
      <WhiteIconButton size='large'>
        <MenuIcon />
      </WhiteIconButton>
    </x.div>
  );
};
