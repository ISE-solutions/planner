import * as React from 'react';
import MUIDataTable from 'mui-datatables';
import label from './labels';
import styles from './table.module.scss';
import { BsFiletypeCsv } from 'react-icons/bs';

interface ITableProps {
  data: any[];
  columns: any[];
  title?: any;
  options?: any;
  refTable?: any;
  components?: any;
}

const Table: React.FC<ITableProps> = ({
  data,
  title,
  columns,
  options,
  components,
  refTable,
}) => {
  const defaultComponents = {
    icons: { DownloadIcon: BsFiletypeCsv },
  };
  const optionsMerged = { ...label, ...options };
  const componentedMerged = { ...defaultComponents, ...components };
  return (
    <MUIDataTable
      ref={refTable}
      data={data}
      title={title}
      className={styles.table}
      columns={columns}
      components={componentedMerged}
      options={optionsMerged}
    />
  );
};

export default Table;
