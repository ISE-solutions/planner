import * as React from 'react';
import MUIDataTable from 'mui-datatables';
import label from './labels';
import styles from './table.module.scss';
import { BsFiletypeCsv } from 'react-icons/bs';
const Table = ({ data, title, columns, options, components, refTable, }) => {
    const defaultComponents = {
        icons: { DownloadIcon: BsFiletypeCsv },
    };
    const optionsMerged = Object.assign(Object.assign({}, label), options);
    const componentedMerged = Object.assign(Object.assign({}, defaultComponents), components);
    return (React.createElement(MUIDataTable, { ref: refTable, data: data, title: title, className: styles.table, columns: columns, components: componentedMerged, options: optionsMerged }));
};
export default Table;
//# sourceMappingURL=index.js.map