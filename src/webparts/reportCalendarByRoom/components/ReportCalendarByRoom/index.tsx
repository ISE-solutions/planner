import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ReportCalendarByRoomPage from './ReportCalendarByRoomPage';

interface IReport {
  context: WebPartContext;
}

const ReportCalendarByRoom: React.FC<IReport> = ({ context }) => {
  return (
    <App context={context}>
      <ReportCalendarByRoomPage context={context} />
    </App>
  );
};

export default ReportCalendarByRoom;
