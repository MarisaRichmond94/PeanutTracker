import { CameraAltRounded } from '@mui/icons-material';
import { Avatar, IconButton, CircularProgress, Tooltip, Button, TextField, FormControl, Select, SelectChangeEvent, MenuItem, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { isNil } from 'lodash';
import { ChangeEvent, useState } from 'react';

import { useAuthentication, useProfile } from '@contexts';
import { Gender, Profile } from '@models';
import { createProfile, saveProfile, uploadProfileAvatar } from '@services';
import { getMaxDayByMonth, toCapitalCase } from '@utils';

export const ProfilePage = () => {
  const { user } = useAuthentication();
  const { age, birthday, gender, name, profile, loadProfile } = useProfile();
  const email = user?.email;

  const [isInEditMode, setIsInEditMode] = useState<boolean>(false);
  const [updatedBirthday, setUpdatedBirthday] = useState<string | undefined>(birthday);
  const [updatedBirthdayError, setUpdatedBirthdayError] = useState<string | undefined>();
  const [updatedGender, setUpdatedGender] = useState<Gender>(gender);
  const [updatedName, setUpdatedName] = useState<string | undefined>(name);
  const [updatedNameError, setUpdatedNameError] = useState<string | undefined>();

  const clearErrorState = () => {
    setUpdatedBirthdayError(undefined);
    setUpdatedNameError(undefined);
  };

  const getUpdatedName = () => {
    if (isNil(updatedName)) return {};

    const splitName = updatedName.split(' ');

    if (splitName.length == 2) {
      return {
        firstName: splitName[0],
        lastName: splitName[1],
      }
    } else {
      return {
        firstName: splitName[0],
        middleName: splitName[1],
        lastName: splitName[2],
      }
    }
  };

  const handleValidation = (): boolean => {
    clearErrorState();

    if (!isNil(updatedBirthday)) {
      const splitBirthday = updatedBirthday.split('/');
      if (splitBirthday.length != 3) {
        setUpdatedBirthdayError('Invalid birthday');
        return true;
      }
      const [month, day, year] = splitBirthday;
      if (Number(month) < 1 || Number(month) > 12) {
        setUpdatedBirthdayError('Invalid month');
        return true;
      }
      if (Number(day) < 0  && Number(day) > getMaxDayByMonth(Number(month))) {
        setUpdatedBirthdayError('Invalid day');
        return true;
      }
      if (Number(year) !== new Date().getFullYear()) {
        setUpdatedBirthdayError('Invalid year');
        return true;
      }
    }

    if (!isNil(updatedName)) {
      const splitName = updatedName.split(' ');
      if (splitName.length <= 1 || splitName.length > 3) {
        setUpdatedNameError('Invalid name');
        return true;
      }
    }

    return false;
  };

  const onResetForm = () => {
    clearErrorState();
    setUpdatedBirthday(birthday);
    setUpdatedGender(gender);
    setUpdatedName(name);
    setIsInEditMode(false);
  };

  const onSaveOrUpdate = async () => {
    if (handleValidation()) return;
    if (isNil(email)) return;

    const { firstName, middleName, lastName } = getUpdatedName();

    if (isNil(profile)) {
      await createProfile({
        birthday,
        email,
        gender,
        firstName,
        middleName,
        lastName,
      });
    } else {
      await saveProfile(profile.id, {
        ...profile,
        birthday: updatedBirthday || birthday,
        gender: updatedGender || gender,
        firstName: firstName || profile.firstName,
        middleName: middleName || profile.middleName,
        lastName: lastName || profile.lastName,
      });
    }

    onResetForm();
    await loadProfile(email);
  };

  return (
    <x.div alignItems='center' display='flex' flexDirection='column' gap='15px'>
      <ProfileAvatar profile={profile} />
      <x.div display='flex' gap='5px'>
        <Button onClick={isInEditMode ? onSaveOrUpdate : () => setIsInEditMode(true)} variant='contained'>
          {isInEditMode ? 'Save' : 'Edit'}
        </Button>
        {
          isInEditMode &&
          <Button color='error' onClick={onResetForm} variant='text'>
            Discard
          </Button>
        }
      </x.div>
      {
        isInEditMode
          ? (
            <x.div display='flex' flexDirection='column' gap='10px'>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Name:</b></Typography>
                <TextField
                  className='skinny-text-field'
                  error={!isNil(updatedNameError)}
                  helperText={updatedNameError}
                  id='name-field'
                  label='Name'
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedName(event.target.value)}
                  placeholder='John Doe or John Michael Doe'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type='string'
                  value={updatedName}
                />
              </x.div>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Gender:</b></Typography>
                <FormControl fullWidth>
                  <Select
                    className='skinny-select'
                    labelId='gender-select-label'
                    id='gender-select'
                    value={updatedGender}
                    onChange={(event: SelectChangeEvent<Gender>) => setUpdatedGender(event.target.value as Gender)}
                  >
                    {
                      Object.values(Gender).map((it, index) =>
                        <MenuItem key={`gender-${index}`} value={it}>
                          {toCapitalCase(it)}
                        </MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
              </x.div>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Born:</b></Typography>
                <TextField
                  className='skinny-text-field'
                  error={!isNil(updatedBirthdayError)}
                  helperText={updatedBirthdayError}
                  id='birthday-field'
                  label='Birthday'
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setUpdatedBirthday(event.target.value)}
                  placeholder='MM/DD/YYYY'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  type='string'
                  value={updatedBirthday}
                />
              </x.div>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Age:</b></Typography>
                {age}
              </x.div>
            </x.div>
          )
          : (
            <x.div display='flex' flexDirection='column' gap='10px'>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Name:</b></Typography>
                {name}
              </x.div>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Gender:</b></Typography>
                {toCapitalCase(gender)}
              </x.div>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Born:</b></Typography>
                {birthday}
              </x.div>
              <x.div display='flex' gap='5px'>
                <Typography color='secondary'><b>Age:</b></Typography>
                {age}
              </x.div>
            </x.div>
          )
      }
    </x.div>
  );
};

type ProfileAvatarProps = {
  profile?: Profile | null;
};

export default function ProfileAvatar({ profile }: ProfileAvatarProps) {
  const { user } = useAuthentication();
  const email = user?.email;

  const [updatedAvatar, setUpdatedAvatar] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0] || isNil(email)) return;
    const file = event.target.files[0];

    setUploading(true);
    try {
      const imageUrl = await uploadProfileAvatar(file, email);
      setUpdatedAvatar(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
    setUploading(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Avatar src={profile?.avatar || updatedAvatar || '/broken-image.png'} sx={{ width: 80, height: 80 }} />
      <Tooltip title='Change Profile Picture'>
        <IconButton
          component='label'
          sx={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
          }}
        >
          <CameraAltRounded />
          <input type='file' accept='image/*' hidden onChange={handleFileChange} />
        </IconButton>
      </Tooltip>
      {uploading && <CircularProgress size={25} sx={{ position: 'absolute', top: '40%', left: '40%' }} />}
    </div>
  );
};
