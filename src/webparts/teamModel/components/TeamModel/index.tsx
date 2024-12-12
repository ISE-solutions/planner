import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import TeamModelPage from './TeamModelPage';

interface ITeamModel {
  context: WebPartContext;
}

const TeamModel: React.FC<ITeamModel> = ({ context }) => {
  return (
    <App context={context}>
      <TeamModelPage context={context} />
    </App>
  );
};

export default TeamModel;
