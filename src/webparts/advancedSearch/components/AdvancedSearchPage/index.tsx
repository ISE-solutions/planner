import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import { App } from '~/components';
import AdvancedSearchPage from './AdvancedSearchPage';

interface IAdvancedSearchProps {
  context: WebPartContext;
}

const AdvancedSearch: React.FC<IAdvancedSearchProps> = ({ context }) => {
  return (
    <App context={context}>
      <AdvancedSearchPage context={context} />
    </App>
  );
};

export default AdvancedSearch;
