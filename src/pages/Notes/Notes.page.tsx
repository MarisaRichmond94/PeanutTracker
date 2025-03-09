import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isEmpty, isNil } from 'lodash';
import { useEffect, useState } from 'react';

import { EmptyState, LoadingState } from '@components';
import { Note, NotePriority } from '@models';
import { getAllNotes, getNotesByPriority } from '@services';
import { toCapitalCase } from '@utils';

import { NoteForm, NoteRecord } from './components';

enum NotePriorityFilter {
  ALL = 'all',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export const NotesPage = () => {
  const [notes, setNotes] = useState<Note[] | undefined>();
  const [filteredNotes, setFilteredNotes] = useState<Note[] | undefined>();
  const [view, setView] = useState<NotePriorityFilter>(NotePriorityFilter.ALL);

  const loadAllNotes = async () => {
    const allNotes = await getAllNotes();
    setNotes(allNotes);
    if (view === NotePriorityFilter.ALL) {
      setFilteredNotes(allNotes);
    } else {
      await loadNotesByPriority(view as unknown as NotePriority);
    }
  };

  const loadNotesByPriority = async (priority: NotePriority) => {
    const notesByPriority = await getNotesByPriority(priority);
    setFilteredNotes(notesByPriority);
  };

  useEffect(() => {
    void loadAllNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === NotePriorityFilter.ALL) {
      setFilteredNotes(notes);
      return;
    }
    void loadNotesByPriority(view as unknown as NotePriority);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view])

  const renderNotes = () => {
    const notesToRender = view === NotePriorityFilter.ALL ? notes : filteredNotes;

    if (isNil(notesToRender)) return <LoadingState />;
    if (isEmpty(notesToRender)) return <EmptyState icon={<DescriptionRoundedIcon />} type='Notes' />;
    return (
      <x.div display='flex' flexDirection='column' gap='15px'>
        {notesToRender.map((note) => <NoteRecord key={`note-${note.id}`} note={note} onSuccess={loadAllNotes} />)}
      </x.div>
    );
  };

  return (
    <x.div id='changing-page'>
      <NoteForm onSuccess={loadAllNotes} />
      <x.div margin='15px 0'>
        <x.div alignItems='center' display='flex' flexDirection='column'>
          <FormControl sx={{ m: 1, width: 200 }}>
            <Select
              className='skinny-select'
              id='note-view-type-select'
              labelId='note-view-type-select-label'
              onChange={(event: SelectChangeEvent<NotePriorityFilter>) => setView(event.target.value as NotePriorityFilter)}
              required
              value={view}
            >
              {
                Object.values(NotePriorityFilter).map((it, index) =>
                  <MenuItem key={`note-view-type-${index}`} value={it}>
                    {toCapitalCase(it)}
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </x.div>
        <x.div marginTop='10px'>
          {renderNotes()}
        </x.div>
      </x.div>
    </x.div>
  );
};
