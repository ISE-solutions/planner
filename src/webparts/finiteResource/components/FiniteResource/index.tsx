import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import FiniteResourcePage from './FiniteResourcePage';

interface IFiniteResourceProps {
  context: WebPartContext;
}

const FiniteResource: React.FC<IFiniteResourceProps> = ({ context }) => {
  return (
    <App context={context}>
      <FiniteResourcePage context={context} />
    </App>
  );
};

export default FiniteResource;
