import { Button, IconButton, styled, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';

export const SecondaryContainedButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: 'white',
}));

export const WhiteIconButtonContainer = styled(x.div)<{ isActive: boolean }>(({ isActive }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  color: isActive ? '#b5ead7' : 'white',
  '&:hover': {
    color: '#b5ead7',
  },
}));

export const WhiteIcon = styled(IconButton)<{ isActive: boolean }>(({ isActive }) => ({
  color: isActive ? '#b5ead7' : 'white',
  padding: 0,
}));

export const WhiteIconButton = styled(IconButton)(() => ({
  color: 'white',
  padding: 0,
  '&:hover': {
    color: '#b5ead7',
  },
}));

export const WhiteIconText = styled(Typography)<{ isActive: boolean }>(({ isActive }) => ({
  color: isActive ? '#b5ead7' : 'white',
  padding: 0,
}));
