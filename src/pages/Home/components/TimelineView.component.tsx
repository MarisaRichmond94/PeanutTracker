/* eslint-disable no-case-declarations */
import 'react-vertical-timeline-component/style.min.css';

import AirlineSeatFlatRoundedIcon from '@mui/icons-material/AirlineSeatFlatRounded';
import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import SanitizerRoundedIcon from '@mui/icons-material/SanitizerRounded';
import { isNil } from 'lodash';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import { BottleFeeding, BreastFeeding, Changing, Feeding, Growth, Pumping, Sleep, SleepLocation, SleepType, WasteType } from '@models';
import { BaseLog, LogEntry, LogType } from '@types';
import { calculateOunceDifference, formatMinutesToHoursAndMinutes, toCapitalCase } from '@utils';

type TimelineViewProps = {
  logs: LogEntry[];
}

export const TimelineView = ({ logs }: TimelineViewProps) => {
  const getIcon = (log: LogEntry) => {
    switch (log.logType) {
      case LogType.BOTTLE_FEEDING:
      case LogType.BREAST_FEEDING:
      case LogType.FEEDING:
        return <LocalDiningRoundedIcon />;
      case LogType.CHANGING:
        return <BabyChangingStationRoundedIcon />;
      case LogType.GROWTH:
        return <GrassRoundedIcon />;
      case LogType.PUMPING:
        return <SanitizerRoundedIcon />;
      case LogType.SLEEP:
        return <AirlineSeatFlatRoundedIcon />;
    }
  };

  const getContent = (log: LogEntry) => {
    const { notes } = log;

    switch (log.logType) {
      case LogType.BOTTLE_FEEDING:
        const { amount, type } = log as BottleFeeding & BaseLog;
        return (
          <h3 className='vertical-timeline-element-title'>
            {`Supplemented with ${amount} ounce(s) of ${type}`}
          </h3>
        );
      case LogType.BREAST_FEEDING:
        const { duration, side, startPounds, startOunces, endPounds, endOunces } = log as BreastFeeding & BaseLog;
        const showWeightChange = [startPounds, startOunces, endPounds, endOunces].every((value) => value != null);
        return (
          <h3 className='vertical-timeline-element-title'>
            {
              showWeightChange
                ? `Transferred ${calculateOunceDifference(startPounds!, startOunces!, endPounds!, endOunces!)} ounce(s) from ${side} side(s) in ${duration} minute(s)`
                : `Breast fed on ${side} side(s) for ${duration} minute(s)`
            }
          </h3>
        );
      case LogType.CHANGING:
        const { type: changingType } = log as Changing & BaseLog;
        const formattedType = changingType === WasteType.BOTH ? 'wet and dirty' : changingType.toLowerCase();
        return (
          <h3 className='vertical-timeline-element-title'>{`Changed ${formattedType} diaper`}</h3>
        );
      case LogType.FEEDING:
        const { food, reaction } = log as Feeding & BaseLog;
        return (
          <>
            <h3 className='vertical-timeline-element-title'>
              Feeding
            </h3>
            <p>
              <b>Food:</b> {food}<br />
              <b>Reaction:</b> {reaction}<br />
              {!isNil(notes) && <><b>Notes:</b> {notes}</>}
            </p>
          </>
        );
      case LogType.GROWTH:
        const { headCircumference, height, weight } = log as Growth & BaseLog;

        return (
          <>
            <h3 className='vertical-timeline-element-title'>Recorded Growth</h3>
            <p>
              {!isNil(headCircumference) && <><b>Head Circumference:</b> {`${headCircumference} centimeters`}<br/></>}
              {!isNil(height) && <><b>Height:</b> {`${height} inches`}<br/></>}
              {!isNil(weight) && <><b>Weight:</b> {`${weight} pounds`}<br/></>}
              {!isNil(notes) && <><b>Notes:</b> {notes}</>}
            </p>
          </>
        );
      case LogType.PUMPING:
        const { duration: pumpDuration, leftAmount, rightAmount } = log as Pumping & BaseLog;
        return (
          <h3 className='vertical-timeline-element-title'>
            {`Pumped ${Math.round((leftAmount + rightAmount) * 100) / 100} ounce(s) in ${pumpDuration} minute(s)`}
          </h3>
        );
      case LogType.SLEEP:
        const { duration: sleepDuration, location, type: sleepType } = log as Sleep & BaseLog;
        const sleepAction = sleepType === SleepType.NAP ? 'Napped' : 'Slept';
        return (
          <h3 className='vertical-timeline-element-title'>
            {`${location === SleepLocation.CONTACT_NAP ? 'Contact Napped' : toCapitalCase(`${sleepAction} in ${location}`)} for ${formatMinutesToHoursAndMinutes(sleepDuration)}`}
          </h3>
        );
    }
  };

  const generateTimelineElement = (log: LogEntry) => {
    return (
      <VerticalTimelineElement
        className='vertical-timeline-element'
        contentStyle={{ background: '#232332', color: 'white' }}
        contentArrowStyle={{ borderRight: '7px solid  #232332' }}
        date={log.time}
        iconStyle={{ background: '#232332', color: 'white' }}
        icon={getIcon(log)}
        key={`timeline-element-${log.id}`}
      >
        {getContent(log)}
      </VerticalTimelineElement>
    );
  };

  return (
    <VerticalTimeline>
      {logs.map((log) => generateTimelineElement(log))}
    </VerticalTimeline>
  );
};
