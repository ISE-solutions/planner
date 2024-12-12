import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import ActivityGroupModelPage from './ActivityGroupModelPage';

interface IActivityGroupModel {
  context: WebPartContext;
}

const ActivityGroupModel: React.FC<IActivityGroupModel> = ({ context }) => {
  return (
    <App context={context}>
      <ActivityGroupModelPage context={context} />
    </App>
  );
};

export default ActivityGroupModel;
