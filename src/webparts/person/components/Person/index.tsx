import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import PersonPage from './PersonPage';

interface IPersonProps {
  context: WebPartContext;
}

const Person: React.FC<IPersonProps> = ({ context }) => {
  return (
    <App context={context}>
      <PersonPage context={context} />
    </App>
  );
};

export default Person;
