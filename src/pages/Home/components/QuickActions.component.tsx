import { ExpandMoreRounded } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Tooltip, Typography } from '@mui/material';
import { x } from '@xstyled/styled-components';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { FaPersonBreastfeeding } from 'react-icons/fa6';
import { FaPoop } from 'react-icons/fa';
import { FaPumpSoap } from 'react-icons/fa6';
import { GiBabyBottle } from 'react-icons/gi';
import { GiNightSleep } from 'react-icons/gi';
import { MdWaterDrop } from 'react-icons/md';

import { BottleType, DefaultSettings, FeedingSide, SleepEntity, SleepLocation, SleepType, WasteColor, WasteConsistency, WasteType } from '@models';
import { createNewBottleFeeding, createNewBreastFeeding, createNewChanging, createNewPumping, createNewSleep, getDefaultSettings } from '@services';
import { FeedingMethod } from '@types';

const BASE_DEFAULTS = {
  pumpTimeInMinutes: 10,
  sleepLocation: SleepLocation.CONTACT_NAP,
  supplementInOunces: 2,
  supplementType: BottleType.BREAST_MILK,
  wasteColor: WasteColor.YELLOW,
  wasteConsistency: WasteConsistency.MUCOUSY,
}

export const QuickActions = () => {
  const [defaultSettings, setDefaultSettings] = useState<DefaultSettings>(BASE_DEFAULTS);
  const [isFormExpanded, setIsFormExpanded] = useState<boolean>(false);

  const fetchDefaultSettings = async () => {
    const defaults = await getDefaultSettings();
    setDefaultSettings(defaults || BASE_DEFAULTS);
  };

  useEffect(() => {
    fetchDefaultSettings();
  }, []);

  const quickLogFeeding = async () => {
    const startTime = dayjs().toISOString();
    const endTime = dayjs().add(1, 'minute');

    await createNewBreastFeeding({
      duration: endTime.diff(startTime, 'minute'),
      endPounds: null,
      endOunces: null,
      method: FeedingMethod.BREAST,
      notes: null,
      side: FeedingSide.BOTH,
      startOunces: null,
      startPounds: null,
      timestamp: startTime,
    });
  };

  const quickLogSupplement = async () => {
    await createNewBottleFeeding({
      amount: defaultSettings.supplementInOunces,
      method: FeedingMethod.BOTTLE,
      notes: null,
      timestamp: dayjs().toISOString(),
      type: defaultSettings.supplementType,
    });
  };

  const quickLogPumpSession = async () => {
    await createNewPumping({
      duration: defaultSettings.pumpTimeInMinutes,
      leftAmount: 0,
      method: FeedingMethod.PUMP,
      notes: null,
      rightAmount: 0,
      timestamp: dayjs().toISOString(),
    });
  };

  const quickLogWetDiaper = async () => {
    await createNewChanging({
      color: WasteColor.NOT_APPLICABLE,
      consistency: WasteConsistency.NOT_APPLICABLE,
      notes: null,
      type: WasteType.WET,
      timestamp: dayjs().toISOString()
    });
  };

  const quickLogComboDiaper = async () => {
    await createNewChanging({
      color: defaultSettings.wasteColor,
      consistency: defaultSettings.wasteConsistency,
      notes: null,
      type: WasteType.BOTH,
      timestamp: dayjs().toISOString()
    });
  };

  const quickLogNap = async () => {
    const startTime = dayjs().toISOString();
    const endTime = dayjs().add(1, 'minute');

    await createNewSleep({
      entity: SleepEntity.BABY,
      duration: endTime.diff(startTime, 'minute'),
      endTime: endTime.toISOString(),
      location: defaultSettings.sleepLocation,
      notes: null,
      startTime,
      type: SleepType.NAP,
    });
  };

  return (
    <Accordion expanded={isFormExpanded} onChange={() => setIsFormExpanded(!isFormExpanded)}>
      <AccordionSummary
        expandIcon={<ExpandMoreRounded />}
        aria-controls='quick-actions-content'
        id='quick-actions-header'
      >
        <Typography sx={{ m: 0, p: 0 }} variant='h6'>Quick Actions</Typography>
        <Divider sx={{ borderColor: 'white' }} />
      </AccordionSummary>
      <AccordionDetails>
        <x.div mb='15px'>
          <Typography variant='body1'>Quickly log events using default settings, which can be configured using the settings page in the menu</Typography>
        </x.div>
        <x.div display='flex' flexWrap='wrap' gap='15px'>
          <Tooltip title='Log feeding'>
            <Button onClick={quickLogFeeding} variant='contained'>
              <FaPersonBreastfeeding size={20} />
            </Button>
          </Tooltip>
          <Tooltip title='Log pump session'>
            <Button onClick={quickLogSupplement} variant='contained'>
              <FaPumpSoap size={20} />
            </Button>
          </Tooltip>
          <Tooltip title='Log supplement'>
            <Button onClick={quickLogPumpSession} variant='contained'>
              <GiBabyBottle size={20} />
            </Button>
          </Tooltip>
          <Tooltip title='Log wet diaper'>
            <Button onClick={quickLogWetDiaper} variant='contained'>
              <MdWaterDrop size={20} />
            </Button>
          </Tooltip>
          <Tooltip title='Log wet and dirty diaper'>
            <Button onClick={quickLogComboDiaper} variant='contained'>
              <FaPoop size={20} />
            </Button>
          </Tooltip>
          <Tooltip title='Log contact nap'>
            <Button onClick={quickLogNap} variant='contained'>
              <GiNightSleep size={20} />
            </Button>
          </Tooltip>
        </x.div>
      </AccordionDetails>
    </Accordion>
  );
};
