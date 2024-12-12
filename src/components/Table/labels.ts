export default {
  textLabels: {
    body: {
      noMatch: 'Não possui registros',
      toolTip: 'Sort',
      columnHeaderTooltip: (column) => `Sort for ${column.label}`,
    },
    pagination: {
      next: 'Próxima Página',
      previous: 'Página Anterior',
      rowsPerPage: 'Items por Página:',
      displayRows: 'de',
    },
    toolbar: {
      search: 'Pesquisar',
      downloadCsv: 'Download CSV',
      print: 'Imprimir',
      viewColumns: 'Visualizar Colunas',
      filterTable: 'Filtrar',
    },
    filter: {
      all: 'Todos',
      title: 'Filtros',
      reset: 'Limpar',
    },
    viewColumns: {
      title: 'Mostrar Colunas',
      titleAria: 'Mostrar/Ocultar Colunas da Tabela',
    },
    selectedRows: {
      text: 'Item(s) Selecionado(s)',
      delete: 'Excluir',
      deleteAria: 'Excluir Selecionados',
    },
  },
};
