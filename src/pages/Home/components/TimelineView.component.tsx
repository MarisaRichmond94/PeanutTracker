/* eslint-disable no-case-declarations */
import 'react-vertical-timeline-component/style.min.css';

import AirlineSeatFlatRoundedIcon from '@mui/icons-material/AirlineSeatFlatRounded';
import BabyChangingStationRoundedIcon from '@mui/icons-material/BabyChangingStationRounded';
import GrassRoundedIcon from '@mui/icons-material/GrassRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import { isNil } from 'lodash';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';

import { BottleFeeding, BreastFeeding, Changing, Feeding, Growth, Sleep, SleepLocation, SleepType, WasteType } from '@models';
import { BaseLog, LogEntry, LogType } from '@types';
import { formatMinutesToHoursAndMinutes, toCapitalCase } from '@utils';

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
      case LogType.SLEEP:
        return <AirlineSeatFlatRoundedIcon />;
    }
  };

  const getContent = (log: LogEntry) => {
    const { notes } = log;

    switch (log.logType) {
      case LogType.BOTTLE_FEEDING:
        const { amount } = log as BottleFeeding & BaseLog;
        return (
          <>
            <h3 className='vertical-timeline-element-title'>
              Bottle Feeding
            </h3>
            <p>
              <b>Amount:</b> {`${amount} ounces`}<br />
              {!isNil(notes) && <><b>Notes:</b> {notes}</>}
            </p>
          </>
        );
      case LogType.BREAST_FEEDING:
        const { duration, side } = log as BreastFeeding & BaseLog;
        return (
          <>
            <h3 className='vertical-timeline-element-title'>
              Breast Feeding
            </h3>
            <p>
              <b>Duration:</b> {`${duration} minutes`}<br />
              <b>Side:</b> {side}<br />
              {!isNil(notes) && <><b>Notes:</b> {notes}</>}
            </p>
          </>
        );
      case LogType.CHANGING:
        const { color, consistency, type: changingType } = log as Changing & BaseLog;
        const formattedType = changingType === WasteType.BOTH ? 'Wet And Dirty' : changingType;

        return (
          <>
            <h3 className='vertical-timeline-element-title'>{toCapitalCase(`Changed ${formattedType} Diaper`)}</h3>
            <p>
              {!isNil(color) && <><b>Color:</b> {color}<br/></>}
              {!isNil(consistency) && <><b>Consistency:</b> {consistency}<br/></>}
              {!isNil(notes) && <><b>Notes:</b> {notes}</>}
            </p>
          </>
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
      case LogType.SLEEP:
        const { duration: sleepDuration, location, type: sleepType } = log as Sleep & BaseLog;
        const sleepAction = sleepType === SleepType.NAP ? 'Napped' : 'Slept';

        return (
          <>
            <h3 className='vertical-timeline-element-title'>
              {location === SleepLocation.CONTACT_NAP ? 'Contact Napped' : toCapitalCase(`${sleepAction} in ${location}`)}
            </h3>
            <p>
              <b>Duration:</b> {formatMinutesToHoursAndMinutes(sleepDuration)}<br/>
              {!isNil(notes) && <><b>Notes:</b> {notes}</>}
            </p>
          </>
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
