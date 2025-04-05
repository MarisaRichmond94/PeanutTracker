import { Box, Button, Card, CardActions } from '@mui/material';
import { ReactNode } from 'react';

type LogProps = {
  id: string;
  isInEditMode: boolean;

  getCardContent: () => ReactNode;
  getEditableCardContent: () => ReactNode;
  onDelete: (idToUpdate: string) => void;
  onDiscard: () => void;
  onUpdate: (idToUpdate: string) => void;
  setIsInEditMode: (isInEditMode: boolean) => void;
}

export const Log = ({
  id,
  isInEditMode,
  getCardContent,
  getEditableCardContent,
  onDelete,
  onDiscard,
  onUpdate,
  setIsInEditMode,
}: LogProps) => (
  <Box
    sx={{
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
      gap: 2,
    }}
  >
    <Card>
      {isInEditMode ? getEditableCardContent() : getCardContent()}
      <CardActions sx={{ justifyContent: 'right' }}>
        <Button color='primary' onClick={isInEditMode ? () => onUpdate(id) : () => setIsInEditMode(true)} variant='contained'>
          {isInEditMode ? 'Update' : 'Edit'}
        </Button>
        <Button color='error' onClick={isInEditMode ? onDiscard : () => onDelete(id)} variant='outlined'>
          {isInEditMode ? 'Discard' : 'Delete'}
        </Button>
      </CardActions>
    </Card>
  </Box>
);
