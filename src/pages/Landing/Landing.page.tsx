import { Button } from '@mui/material';
import { x } from '@xstyled/styled-components';

import { useAuthentication } from '@contexts';

export const LandingPage = () => {
  const { signInWithGoogle } = useAuthentication();

  return (
    <x.div alignItems='center' display='flex' flexDirection='column' gap='20px' paddingTop='40vw'>
      <x.img src='/assets/landing_logo.png' alt='Landing Logo' w='75vw' />
      <Button color='primary' onClick={signInWithGoogle} variant='contained'>
        Sign In With Google
      </Button>
    </x.div>
  );
};
