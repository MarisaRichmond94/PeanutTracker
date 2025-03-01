import { x } from '@xstyled/styled-components';

import { useAuthentication, useGlobal } from '@contexts';
import { SecondaryContainedButton } from '@styles';
import { Page } from '@types';

import { SectionHeader } from './SectionHeader.component';

export const HeaderMenu = ({ setShowHeaderMenu }: { setShowHeaderMenu: (showHeaderMenu: boolean) => void }) => {
  const { signOutWithGoogle } = useAuthentication();
  const { setPage } = useGlobal();

  const navigateBackHome = () => {
    setShowHeaderMenu(false);
    setPage(Page.HOME);
  };

  return (
    <x.div display='flex' flexDirection='column' gap='20px' padding='20px'>
      <SectionHeader onClick={navigateBackHome} text='Menu' />
      <HeaderMenuButton page={Page.PROGRESS} text='Progress' setShowHeaderMenu={setShowHeaderMenu} />
      <HeaderMenuButton page={Page.PROFILE} text='Profile' setShowHeaderMenu={setShowHeaderMenu} />
      <HeaderMenuButton page={Page.NOTES} text='Notes' setShowHeaderMenu={setShowHeaderMenu} />
      <SecondaryContainedButton onClick={signOutWithGoogle} size='large' variant='contained'>
        Sign Out
      </SecondaryContainedButton>
    </x.div>
  );
};

type HeaderMenuButtonProps = {
  page: Page;
  text: string;
  setShowHeaderMenu: (showHeaderMenu: boolean) => void;
}

const HeaderMenuButton = ({ page, text, setShowHeaderMenu }: HeaderMenuButtonProps) => {
  const { setPage } = useGlobal();

  const onClick = () => {
    setPage(page);
    setShowHeaderMenu(false);
  };

  return (
    <SecondaryContainedButton onClick={onClick} size='large' variant='contained'>
      {text}
    </SecondaryContainedButton>
  );
};
