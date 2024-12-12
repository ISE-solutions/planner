import * as React from 'react';
import { PREFIX } from '~/config/database';
import { GROUP_FILTER } from './constants';
import * as moment from 'moment';
import * as _ from 'lodash';
import { EFatherTag } from '~/config/enums';
import { Checkbox, FormControlLabel } from '@material-ui/core';
const setCellProps = () => ({
    style: {
        padding: '10px',
    },
});
export const COLUMNS_GROUP = ({ rowData, rowsSelectedToExport, setRowsSelectedToExport, }) => {
    const allSelected = () => {
        return rowData.length && rowData.length === rowsSelectedToExport.length;
    };
    const handleSelectAll = () => {
        if (allSelected()) {
            setRowsSelectedToExport([]);
        }
        else {
            setRowsSelectedToExport(Array.from(rowData, (_, index) => index));
        }
    };
    return {
        [GROUP_FILTER.ATIVIDADE]: [
            {
                name: `selectRow`,
                id: 'e4d85fc0-5f6e-4e5b-93d8-8a7d84d92be2',
                label: (React.createElement(FormControlLabel, { onChange: handleSelectAll, value: allSelected(), control: React.createElement(Checkbox, { color: 'primary', value: allSelected(), checked: allSelected(), name: 'sel' }), label: '' })),
                hideColumn: true,
                group: 'Atividade',
                options: {
                    display: true,
                    download: false,
                    sort: false,
                    filter: false,
                    draggable: false,
                    setCellProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: '0',
                            background: 'white',
                            zIndex: 100,
                        },
                    }),
                    setCellHeaderProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: 0,
                            background: 'white',
                            zIndex: 101,
                        },
                    }),
                },
            },
            {
                name: `${PREFIX}nome`,
                id: 'f39501b1-4020-462a-9cff-aa47410a0417',
                label: 'Nome',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `start`,
                id: 'cf9692d5-ecae-44ab-a3ab-db735ce47200',
                label: 'Início',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `end`,
                id: '13e77da6-3403-4c85-96b8-6cea8f423e2a',
                label: 'Fim',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `${PREFIX}duracao`,
                id: '0874d6c9-c080-4a6f-84fe-f9ee09d8643d',
                label: 'Duração',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `${PREFIX}quantidadesessao`,
                id: '85f6df77-67b0-4e8e-ab5a-e0d771e76875',
                label: 'Quantidade de Sessões',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `${PREFIX}AreaAcademica.${PREFIX}nome`,
                id: 'c76fe1b9-24d6-4667-8045-ce7a6ff1ec5b',
                label: 'Área Acadêmica',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `spaces`,
                id: 'a7b62388-b1c7-4c05-ac9a-1e2443a26133',
                label: 'Espaço',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `people`,
                id: 'e3a8b06a-a696-4016-a856-31b15f06620b',
                label: 'Pessoas(s)',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `document`,
                id: '8ccf1dce-094c-44be-9780-60f599feb8e1',
                label: 'Documento(s)',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `academicRequest`,
                id: '3878cc3f-4800-46cb-b9db-5cf7d9511a1b',
                label: 'Requisição Acadêmica(s)',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '230px' } };
                    },
                },
            },
            {
                name: `${PREFIX}Temperatura.${PREFIX}nome`,
                id: 'ae7448a3-3e78-458c-a5dc-c4b77211561f',
                label: 'Temperatura',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `dateSchedule`,
                id: '912a8eef-ae00-4465-aebd-c3cc8d2e0abc',
                label: 'Data',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Modulo.${PREFIX}nome`,
                id: 'b05ba8ef-523e-4cce-99d4-f96878ffd246',
                label: 'Módulo (Cronograma Dia)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Modalidade.${PREFIX}nome`,
                id: 'd2de1541-c8ff-4384-ad72-0093bd14123a',
                label: 'Modalidade (Cronograma Dia)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Ferramenta.${PREFIX}nome`,
                id: 'e309cf2d-48bc-428c-872a-a7afcea67db6',
                label: 'Ferramenta',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}FerramentaBackup.${PREFIX}nome`,
                id: '63b68374-6a75-4d98-9c4b-80bf0c2fb0d7',
                label: 'Ferramenta Backup',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}link`,
                id: '8633c3c2-ab8d-4d66-bfec-d1d3bfdfe1de',
                label: 'Link',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}linkbackup`,
                id: '5881dee4-df3a-4e4d-bee7-1942565633d9',
                label: 'Link (Backup)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Temperatura.${PREFIX}nome`,
                id: 'a2079f5e-08e1-400e-be10-35c7fa917dcc',
                label: 'Temperatura (Cronograma Dia)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `peopleSchedule`,
                id: 'bfc97139-ad57-4f6a-88ff-f1de41785423',
                label: 'Pessoas(s)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}nome`,
                id: '0d957189-b625-469e-97f8-94f3f907057e',
                label: 'Nome da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}sigla`,
                id: '875abb5a-e9dd-443a-bff5-f38377b0eeec',
                label: 'Sigla da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}codigodaturma`,
                id: 'bef29fe9-b0b8-45cb-8828-757ed2f05dff',
                label: 'Código da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}nomefinanceiro`,
                id: '6d2995c8-9f10-4bac-b601-6ceff76d7894',
                label: 'Nome da Turma Financeiro',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}mascara`,
                id: '7b363758-882a-44ce-abb2-3342fc6e2e1d',
                group: 'Turma',
                label: 'Link',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}mascarabackup`,
                id: 'd8e89f87-80e9-468a-b6f7-cf6f76ef9705',
                group: 'Turma',
                label: 'Link (Backup)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}anodeconclusao`,
                id: '6ba842f5-7e1a-4d20-ac21-e1c4dcf71a80',
                group: 'Turma',
                label: 'Ano de Conclusão',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}Temperatura.${PREFIX}nome`,
                id: 'a88f11d1-dcd7-4926-9b2b-bd7bdbcaf44a',
                group: 'Turma',
                label: 'Temperatura (Turma)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}Modalidade.${PREFIX}nome`,
                id: '119c4da8-cc09-47e7-9be1-7dadbacf2f4f',
                group: 'Turma',
                label: 'Modalidade (Turma)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `participantTeam`,
                id: '0fe9f629-bee4-4086-b92e-dd6c7c1d03a5',
                label: 'Participantes (Turma)',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `peopleTeam`,
                id: 'fd0a7459-6b24-4f36-8651-2331a56847dc',
                label: 'Pessoas Envolvidas (Turma)',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}NomePrograma.${PREFIX}nome`,
                id: '95afa676-243b-40ce-ad78-94a8881f84c1',
                label: 'Nome do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}sigla`,
                id: '03c04814-ad54-46d6-94e7-c2f06f08c330',
                label: 'Sigla do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}TipoPrograma.${PREFIX}nome`,
                id: 'ec8d2097-bb13-410c-bc8b-d6be8af2e142',
                label: 'Tipo do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Instituto.${PREFIX}nome`,
                id: '32a2f999-ebc4-4334-9cc8-cb9dfeff849e',
                label: 'Instituto',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Empresa.${PREFIX}nome`,
                id: '6501e584-5f8e-42af-a4ec-44330675bc51',
                label: 'Empresa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Temperatura.${PREFIX}nome`,
                id: '3991f296-91e1-477f-ae71-432a156537ff',
                label: 'Temperatura (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `peopleProgram`,
                id: 'ec45085c-effd-4b67-ada8-e9131e0ddfe7',
                label: 'Pessoas Envolvidas (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
        ],
        [GROUP_FILTER.DIA]: [
            {
                name: `selectRow`,
                id: 'e4d85fc0-5f6e-4e5b-93d8-8a7d84d92be2',
                label: (React.createElement(FormControlLabel, { onChange: handleSelectAll, value: allSelected(), control: React.createElement(Checkbox, { color: 'primary', value: allSelected(), checked: allSelected(), name: 'sel' }), label: '' })),
                hideColumn: true,
                group: 'Dia de aula',
                options: {
                    display: true,
                    download: false,
                    sort: false,
                    filter: false,
                    draggable: false,
                    setCellProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: '0',
                            background: 'white',
                            zIndex: 100,
                        },
                    }),
                    setCellHeaderProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: 0,
                            background: 'white',
                            zIndex: 101,
                        },
                    }),
                },
            },
            {
                name: `dateSchedule`,
                id: '08a94e64-b20f-44d6-a213-c57c988b6a23',
                label: 'Data',
                group: 'Atividade',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Modulo.${PREFIX}nome`,
                id: 'f32f5bbd-18a8-44d2-b63b-f4342e431e02',
                label: 'Módulo (Cronograma Dia)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Modalidade.${PREFIX}nome`,
                id: '144eea3e-49cb-47b0-ba65-636cbede49a4',
                label: 'Modalidade (Cronograma Dia)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Ferramenta.${PREFIX}nome`,
                id: '104c58a6-068d-4797-a086-e06b058e04f8',
                label: 'Ferramenta',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}FerramentaBackup.${PREFIX}nome`,
                id: 'ae15866d-82f8-4f3c-b252-b7bdf84a3a02',
                label: 'Ferramenta Backup',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}link`,
                id: '40c8166e-f25e-4ecb-9610-c632184e36f1',
                label: 'Link',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}linkbackup`,
                id: '87a37f5a-819b-4879-8b13-53007ddd8755',
                label: 'Link (Backup)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `schedule.${PREFIX}Temperatura.${PREFIX}nome`,
                id: '2711dd97-f322-44d2-bc13-87cabe0685c6',
                label: 'Temperatura (Cronograma Dia)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '135px' } };
                    },
                },
            },
            {
                name: `peopleSchedule`,
                id: '7dfda7d7-6d9a-45c7-b7a7-cd6c5d7be75f',
                label: 'Pessoas(s)',
                group: 'Cronograma Dia',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}nome`,
                id: '079bf718-ea6a-4ca7-aa35-fd9124992bf1',
                label: 'Nome da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}sigla`,
                id: '9c41845a-f5bd-452e-b5ca-6db82060f173',
                label: 'Sigla da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}codigodaturma`,
                id: '3aff2ab3-e46e-41cb-83e2-1c03f8d512a0',
                label: 'Código da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}nomefinanceiro`,
                id: 'a1791385-4252-4d15-ba60-27172ff34347',
                label: 'Nome da Turma Financeiro',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}mascara`,
                id: 'c8d5dd4e-6d8c-4988-996a-a7c8bf856047',
                group: 'Turma',
                label: 'Link',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}mascarabackup`,
                id: 'c9fcca21-e43e-4098-83dc-988d4d955599',
                group: 'Turma',
                label: 'Link (Backup)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}anodeconclusao`,
                id: 'c6ff4b6f-83e9-45aa-898f-474870c577e6',
                group: 'Turma',
                label: 'Ano de Conclusão',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}Temperatura.${PREFIX}nome`,
                id: '04f2b62d-bc6a-48e4-bca6-c820b3357f74',
                group: 'Turma',
                label: 'Temperatura (Turma)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}Modalidade.${PREFIX}nome`,
                id: '5e28fab7-dc15-48e5-924f-f03e1415088d',
                group: 'Turma',
                label: 'Modalidade (Turma)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `participantTeam`,
                id: 'e55a92db-e0da-4945-954f-ade3fb902345',
                label: 'Participantes (Turma)',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `peopleTeam`,
                id: '1caea647-8605-4f7f-8438-ea3b8452d824',
                label: 'Pessoas Envolvidas (Turma)',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}NomePrograma.${PREFIX}nome`,
                id: '1e8acfe4-2f19-4081-b9df-8415a0132a87',
                label: 'Nome do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}sigla`,
                id: '92b4229d-e478-4f83-a039-cd8dfc3960d9',
                label: 'Sigla do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}TipoPrograma.${PREFIX}nome`,
                id: 'e28a1b4d-de7a-40db-a8ae-abc578969d02',
                label: 'Tipo do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Instituto.${PREFIX}nome`,
                id: '30037c29-7232-4d34-bcd4-76c42f0a1cfe',
                label: 'Instituto',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Empresa.${PREFIX}nome`,
                id: 'c35f12ec-308a-43a5-86e1-56698e79dfb5',
                label: 'Empresa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Temperatura.${PREFIX}nome`,
                id: 'd3718d8f-192c-47ec-b645-4a9fa1053206',
                label: 'Temperatura (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `peopleProgram`,
                id: 'c783ddd3-ebc9-4eee-9979-2cb06b01b552',
                label: 'Pessoas Envolvidas (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
        ],
        [GROUP_FILTER.TURMA]: [
            {
                name: `selectRow`,
                id: 'e4d85fc0-5f6e-4e5b-93d8-8a7d84d92be2',
                label: (React.createElement(FormControlLabel, { onChange: handleSelectAll, value: allSelected(), control: React.createElement(Checkbox, { color: 'primary', value: allSelected(), checked: allSelected(), name: 'sel' }), label: '' })),
                hideColumn: true,
                group: 'Turma',
                options: {
                    display: true,
                    download: false,
                    sort: false,
                    filter: false,
                    draggable: false,
                    setCellProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: '0',
                            background: 'white',
                            zIndex: 100,
                        },
                    }),
                    setCellHeaderProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: 0,
                            background: 'white',
                            zIndex: 101,
                        },
                    }),
                },
            },
            {
                name: `team.${PREFIX}nome`,
                id: 'c65063bc-03f6-4e65-ac01-4412d41d8ce4',
                label: 'Nome da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}sigla`,
                id: 'eeebe40e-d68f-474b-8acb-47c07fb3a3a0',
                label: 'Sigla da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}codigodaturma`,
                id: '9f3ba4be-11ce-441a-b909-f243a8f43aa0',
                label: 'Código da Turma',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}nomefinanceiro`,
                id: 'ea5c04be-8e67-4235-9ccd-3dfe63d329ce',
                label: 'Nome da Turma Financeiro',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}mascara`,
                id: 'a06549a0-401a-49ca-aa31-93cb0bc9d58e',
                group: 'Turma',
                label: 'Link',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}mascarabackup`,
                id: '54a8152b-ec12-4eee-9085-367e46bbb314',
                group: 'Turma',
                label: 'Link (Backup)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}anodeconclusao`,
                id: '7031af8d-a584-4e9e-a3a8-121b3d9e20ac',
                group: 'Turma',
                label: 'Ano de Conclusão',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}Temperatura.${PREFIX}nome`,
                id: '6a2bd052-7ddd-45d6-bb00-f1f16494fb6f',
                group: 'Turma',
                label: 'Temperatura (Turma)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `team.${PREFIX}Modalidade.${PREFIX}nome`,
                id: '13c90bf3-ce41-498b-95e6-aa97e292914a',
                group: 'Turma',
                label: 'Modalidade (Turma)',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `participantTeam`,
                id: '6e3c9bc9-4f95-45ee-9dd0-83284a373f48',
                label: 'Participantes (Turma)',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `peopleTeam`,
                id: '1252612b-5e04-45a0-9e36-03470255e56e',
                label: 'Pessoas Envolvidas (Turma)',
                group: 'Turma',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}NomePrograma.${PREFIX}nome`,
                id: '6568fc86-7370-4e34-8d93-327d5f2bd160',
                label: 'Nome do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}sigla`,
                id: 'cf0aca13-c2ba-48cc-bb0e-49d397b20e44',
                label: 'Sigla do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}TipoPrograma.${PREFIX}nome`,
                id: '0f02a13d-c983-443e-95be-41eeef92f7d9',
                label: 'Tipo do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Instituto.${PREFIX}nome`,
                id: '0fa447ca-aa9d-4eb0-ae04-8ae451eae8bc',
                label: 'Instituto',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Empresa.${PREFIX}nome`,
                id: '0fc40bff-75b5-4f0f-8d67-bc2159cebdba',
                label: 'Empresa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Temperatura.${PREFIX}nome`,
                id: 'd2619f54-869c-431c-93c6-ca4e87f59fc2',
                label: 'Temperatura (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `peopleProgram`,
                id: '88604776-6cb7-48ea-afd2-80f349dace83',
                label: 'Pessoas Envolvidas (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
        ],
        [GROUP_FILTER.PROGRAM]: [
            {
                name: `selectRow`,
                id: 'e4d85fc0-5f6e-4e5b-93d8-8a7d84d92be2',
                label: (React.createElement(FormControlLabel, { onChange: handleSelectAll, value: allSelected(), control: React.createElement(Checkbox, { color: 'primary', value: allSelected(), checked: allSelected(), name: 'sel' }), label: '' })),
                hideColumn: true,
                group: 'Programa',
                options: {
                    display: true,
                    download: false,
                    sort: false,
                    filter: false,
                    draggable: false,
                    setCellProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: '0',
                            background: 'white',
                            zIndex: 100,
                        },
                    }),
                    setCellHeaderProps: () => ({
                        style: {
                            whiteSpace: 'nowrap',
                            position: 'sticky',
                            left: 0,
                            background: 'white',
                            zIndex: 101,
                        },
                    }),
                },
            },
            {
                name: `program.${PREFIX}NomePrograma.${PREFIX}nome`,
                id: '044ae746-d0ca-441d-9654-1ebde563fd09',
                label: 'Nome do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}sigla`,
                id: '713deb8c-e052-4b9b-812e-13d25d7282b9',
                label: 'Sigla do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}TipoPrograma.${PREFIX}nome`,
                id: '94ef7add-89e1-460a-94ca-85b04a61d177',
                label: 'Tipo do Programa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '200px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Instituto.${PREFIX}nome`,
                id: 'ca3e9889-598e-4b22-a29e-fddb2738c7d7',
                label: 'Instituto',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Empresa.${PREFIX}nome`,
                id: '2abdf6f8-d3bc-4402-949a-d573dad40f09',
                label: 'Empresa',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `program.${PREFIX}Temperatura.${PREFIX}nome`,
                id: '46bdd69a-03c9-4aa3-a17f-e4534e229098',
                label: 'Temperatura (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '100px' } };
                    },
                },
            },
            {
                name: `peopleProgram`,
                id: '24dc8607-6b11-4473-81a8-e8649b0e101e',
                label: 'Pessoas Envolvidas (Programa)',
                group: 'Programa',
                options: {
                    display: true,
                    setCellProps,
                    setCellHeaderProps: () => {
                        return { style: { minWidth: '400px' } };
                    },
                },
            },
        ],
    };
};
export const formatActivityRows = ({ activities, dictTag, dictPeople, dictSpace, rowsSelectedToExport, setRowsSelectedToExport, }) => {
    let newActivities = _.cloneDeep(activities);
    const groupedActivities = _.groupBy(newActivities, (it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}atividadeid`]);
    const activitiesResult = [];
    const handleCheck = (event, index) => {
        if (event.target.checked) {
            setRowsSelectedToExport([...rowsSelectedToExport, index]);
        }
        else {
            setRowsSelectedToExport(rowsSelectedToExport.filter((e) => e !== index));
        }
    };
    Object.keys(groupedActivities).forEach((key, i) => {
        var _a;
        const actvArray = groupedActivities[key];
        const firstActv = groupedActivities[key][0];
        let spaces = [];
        let document = [];
        let people = [];
        let peopleTeam = [];
        let peopleSchedule = [];
        let peopleProgram = [];
        let participantTeam = [];
        let requestAcademic = [];
        actvArray.forEach((elm) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const per = (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`${PREFIX}pessoa`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`];
            const func = (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`${PREFIX}funcao`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
            people.push(`${per || ''} ${func ? `(${func})` : ''}`);
            const fullSpace = dictSpace === null || dictSpace === void 0 ? void 0 : dictSpace[elm === null || elm === void 0 ? void 0 : elm[`${PREFIX}espacoid`]];
            const capacity = fullSpace === null || fullSpace === void 0 ? void 0 : fullSpace[`${PREFIX}Espaco_CapacidadeEspaco`].find((cap) => {
                var _a;
                return ((_a = dictTag === null || dictTag === void 0 ? void 0 : dictTag[cap === null || cap === void 0 ? void 0 : cap[`_${PREFIX}uso_value`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`]) ===
                    EFatherTag.ALERTA;
            });
            if (fullSpace) {
                spaces.push(`${fullSpace === null || fullSpace === void 0 ? void 0 : fullSpace[`${PREFIX}nome`]}(${(capacity === null || capacity === void 0 ? void 0 : capacity[`${PREFIX}quantidade`]) || ''})`);
            }
            document.push(elm === null || elm === void 0 ? void 0 : elm[`documento_nome`]);
            const perTeam = (_c = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`turma_pessoa`]]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nomecompleto`];
            const funcTeam = (_d = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`turma_funcao`]]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`];
            peopleTeam.push(`${perTeam || ''} ${funcTeam ? `(${funcTeam})` : ''}`);
            const perProgram = (_e = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`programa_pessoa`]]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}nomecompleto`];
            const funcProgram = (_f = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`programa_funcao`]]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`];
            peopleProgram.push(`${perProgram || ''} ${funcProgram ? `(${funcProgram})` : ''}`);
            const perSchedule = (_g = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`programa_pessoa`]]) === null || _g === void 0 ? void 0 : _g[`${PREFIX}nomecompleto`];
            const funcSchedule = (_h = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`programa_funcao`]]) === null || _h === void 0 ? void 0 : _h[`${PREFIX}nome`];
            peopleSchedule.push(`${perProgram || ''} ${perSchedule ? `(${funcSchedule})` : ''}`);
            participantTeam.push(`${elm.participante_data
                ? moment(elm.participante_data).format('DD/MM/YYYY')
                : ''} (${elm.participante_quantidade || ''})`);
            requestAcademic.push(elm.requisicao_descricao);
        });
        activitiesResult.push(Object.assign(Object.assign({}, firstActv), { selectRow: (React.createElement(FormControlLabel, { value: rowsSelectedToExport.includes(i), control: React.createElement(Checkbox, { color: 'primary', checked: rowsSelectedToExport.includes(i), value: rowsSelectedToExport.includes(i), onChange: (event) => handleCheck(event, i), name: 'sel' }), label: '' })), start: moment((firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}datahorainicio`]) + 'Z').format('DD/MM/YYYY HH:mm'), dateSchedule: moment(firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}data`]).format('DD/MM/YYYY'), programName: (_a = dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}nomeprograma`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`], end: moment((firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}datahorafim`]) + 'Z').format('DD/MM/YYYY HH:mm'), [`${PREFIX}AreaAcademica`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}areaacademica`]], [`${PREFIX}Temperatura`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}temperatura`]], schedule: {
                [`${PREFIX}Modulo`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}modulo`]],
                [`${PREFIX}link`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}link`],
                [`${PREFIX}linkbackup`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}linkbackup`],
                [`${PREFIX}Modalidade`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`modalidade_dia`]],
                [`${PREFIX}Ferramenta`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}ferramenta`]],
                [`${PREFIX}Temperatura`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`cronograma_temperatura`]],
                [`${PREFIX}FerramentaBackup`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}ferramentabackup`]],
            }, team: {
                [`${PREFIX}nome`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`turma_nome`],
                [`${PREFIX}sigla`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}sigla`],
                [`${PREFIX}codigodaturma`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}codigodaturma`],
                [`${PREFIX}nomefinanceiro`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}nomefinanceiro`],
                [`${PREFIX}mascara`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}mascara`],
                [`${PREFIX}mascarabackup`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}mascarabackup`],
                [`${PREFIX}anodeconclusao`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}anodeconclusao`],
                [`${PREFIX}Modalidade`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`turma_modalidade`]],
                [`${PREFIX}Temperatura`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`turma_temperatura`]],
            }, program: {
                [`${PREFIX}NomePrograma`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}nomeprograma`]],
                [`${PREFIX}sigla`]: firstActv === null || firstActv === void 0 ? void 0 : firstActv[`programa_sigla`],
                [`${PREFIX}TipoPrograma`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}tipoprograma`]],
                [`${PREFIX}Instituto`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}instituto`]],
                [`${PREFIX}Empresa`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`${PREFIX}empresa`]],
                [`${PREFIX}Temperatura`]: dictTag[firstActv === null || firstActv === void 0 ? void 0 : firstActv[`programa_temperatura`]],
            }, spaces: _.uniq(spaces)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), document: _.uniq(document)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), participantTeam: _.uniq(participantTeam)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), academicRequest: _.uniq(requestAcademic)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleSchedule: _.uniq(peopleSchedule)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), people: _.uniq(people)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleTeam: _.uniq(peopleTeam)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleProgram: _.uniq(peopleProgram)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', ') }));
    });
    return activitiesResult;
};
export const formatScheduleRows = ({ schedules, dictTag, dictPeople, rowsSelectedToExport, setRowsSelectedToExport, }) => {
    let newSchedules = _.cloneDeep(schedules);
    const groupedSchedules = _.groupBy(newSchedules, (it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}cronogramadediaid`]);
    const scheduleResult = [];
    const handleCheck = (event, index) => {
        if (event.target.checked) {
            setRowsSelectedToExport([...rowsSelectedToExport, index]);
        }
        else {
            setRowsSelectedToExport(rowsSelectedToExport.filter((e) => e !== index));
        }
    };
    Object.keys(groupedSchedules).forEach((key, i) => {
        var _a;
        const itemArray = groupedSchedules[key];
        const firstItem = groupedSchedules[key][0];
        let peopleTeam = [];
        let peopleSchedule = [];
        let peopleProgram = [];
        let participantTeam = [];
        itemArray.forEach((elm) => {
            var _a, _b, _c, _d, _e, _f;
            const perTeam = (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`turma_pessoa`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`];
            const funcTeam = (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`turma_funcao`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
            peopleTeam.push(`${perTeam || ''} ${funcTeam ? `(${funcTeam})` : ''}`);
            const perProgram = (_c = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`programa_pessoa`]]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nomecompleto`];
            const funcProgram = (_d = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`programa_funcao`]]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`];
            peopleProgram.push(`${perProgram || ''} ${funcProgram ? `(${funcProgram})` : ''}`);
            const perSchedule = (_e = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`programa_pessoa`]]) === null || _e === void 0 ? void 0 : _e[`${PREFIX}nomecompleto`];
            const funcSchedule = (_f = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`programa_funcao`]]) === null || _f === void 0 ? void 0 : _f[`${PREFIX}nome`];
            peopleSchedule.push(`${perProgram || ''} ${perSchedule ? `(${funcSchedule})` : ''}`);
            participantTeam.push(`${elm.participante_data
                ? moment(elm.participante_data).format('DD/MM/YYYY')
                : ''} (${elm.participante_quantidade || ''})`);
        });
        scheduleResult.push(Object.assign(Object.assign({}, firstItem), { selectRow: (React.createElement(FormControlLabel, { value: rowsSelectedToExport.includes(i), control: React.createElement(Checkbox, { color: 'primary', checked: rowsSelectedToExport.includes(i), value: rowsSelectedToExport.includes(i), onChange: (event) => handleCheck(event, i), name: 'sel' }), label: '' })), dateSchedule: moment(firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}data`]).format('DD/MM/YYYY'), programName: (_a = dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomeprograma`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`], schedule: {
                [`${PREFIX}Modulo`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}modulo`]],
                [`${PREFIX}link`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}link`],
                [`${PREFIX}linkbackup`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}linkbackup`],
                [`${PREFIX}Modalidade`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`modalidade_dia`]],
                [`${PREFIX}Ferramenta`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}ferramenta`]],
                [`${PREFIX}Temperatura`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`cronograma_temperatura`]],
                [`${PREFIX}FerramentaBackup`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}ferramentabackup`]],
            }, team: {
                [`${PREFIX}nome`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`turma_nome`],
                [`${PREFIX}sigla`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}sigla`],
                [`${PREFIX}codigodaturma`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}codigodaturma`],
                [`${PREFIX}nomefinanceiro`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomefinanceiro`],
                [`${PREFIX}mascara`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}mascara`],
                [`${PREFIX}mascarabackup`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}mascarabackup`],
                [`${PREFIX}anodeconclusao`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}anodeconclusao`],
                [`${PREFIX}Modalidade`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`turma_modalidade`]],
                [`${PREFIX}Temperatura`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`turma_temperatura`]],
            }, program: {
                [`${PREFIX}NomePrograma`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomeprograma`]],
                [`${PREFIX}sigla`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`programa_sigla`],
                [`${PREFIX}TipoPrograma`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}tipoprograma`]],
                [`${PREFIX}Instituto`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}instituto`]],
                [`${PREFIX}Empresa`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}empresa`]],
                [`${PREFIX}Temperatura`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`programa_temperatura`]],
            }, participantTeam: _.uniq(participantTeam)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleSchedule: _.uniq(peopleSchedule)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleTeam: _.uniq(peopleTeam)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleProgram: _.uniq(peopleProgram)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', ') }));
    });
    return scheduleResult;
};
export const formatTeamRows = ({ teams, dictTag, dictPeople, rowsSelectedToExport, setRowsSelectedToExport, }) => {
    let newTeams = _.cloneDeep(teams);
    const groupedTeams = _.groupBy(newTeams, (it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}turmaid`]);
    const teamResult = [];
    const handleCheck = (event, index) => {
        if (event.target.checked) {
            setRowsSelectedToExport([...rowsSelectedToExport, index]);
        }
        else {
            setRowsSelectedToExport(rowsSelectedToExport.filter((e) => e !== index));
        }
    };
    Object.keys(groupedTeams).forEach((key, i) => {
        var _a;
        const itemArray = groupedTeams[key];
        const firstItem = groupedTeams[key][0];
        let peopleTeam = [];
        let peopleProgram = [];
        let participantTeam = [];
        itemArray.forEach((elm) => {
            var _a, _b, _c, _d;
            const perTeam = (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`turma_pessoa`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`];
            const funcTeam = (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`turma_funcao`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
            peopleTeam.push(`${perTeam || ''} ${funcTeam ? `(${funcTeam})` : ''}`);
            const perProgram = (_c = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`programa_pessoa`]]) === null || _c === void 0 ? void 0 : _c[`${PREFIX}nomecompleto`];
            const funcProgram = (_d = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`programa_funcao`]]) === null || _d === void 0 ? void 0 : _d[`${PREFIX}nome`];
            peopleProgram.push(`${perProgram || ''} ${funcProgram ? `(${funcProgram})` : ''}`);
            participantTeam.push(`${elm.participante_data
                ? moment(elm.participante_data).format('DD/MM/YYYY')
                : ''} (${elm.participante_quantidade || ''})`);
        });
        teamResult.push(Object.assign(Object.assign({}, firstItem), { selectRow: (React.createElement(FormControlLabel, { value: rowsSelectedToExport.includes(i), control: React.createElement(Checkbox, { color: 'primary', checked: rowsSelectedToExport.includes(i), value: rowsSelectedToExport.includes(i), onChange: (event) => handleCheck(event, i), name: 'sel' }), label: '' })), dateSchedule: moment(firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}data`]).format('DD/MM/YYYY'), programName: (_a = dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomeprograma`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`], team: {
                [`${PREFIX}nome`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`turma_nome`],
                [`${PREFIX}sigla`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}sigla`],
                [`${PREFIX}codigodaturma`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}codigodaturma`],
                [`${PREFIX}nomefinanceiro`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomefinanceiro`],
                [`${PREFIX}mascara`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}mascara`],
                [`${PREFIX}mascarabackup`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}mascarabackup`],
                [`${PREFIX}anodeconclusao`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}anodeconclusao`],
                [`${PREFIX}Modalidade`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`turma_modalidade`]],
                [`${PREFIX}Temperatura`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`turma_temperatura`]],
            }, program: {
                [`${PREFIX}NomePrograma`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomeprograma`]],
                [`${PREFIX}sigla`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`programa_sigla`],
                [`${PREFIX}TipoPrograma`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}tipoprograma`]],
                [`${PREFIX}Instituto`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}instituto`]],
                [`${PREFIX}Empresa`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}empresa`]],
                [`${PREFIX}Temperatura`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`programa_temperatura`]],
            }, participantTeam: _.uniq(participantTeam)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleTeam: _.uniq(peopleTeam)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', '), peopleProgram: _.uniq(peopleProgram)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', ') }));
    });
    return teamResult;
};
export const formatProgramRows = ({ programs, dictTag, dictPeople, rowsSelectedToExport, setRowsSelectedToExport, }) => {
    let newPrograms = _.cloneDeep(programs);
    const groupedPrograms = _.groupBy(newPrograms, (it) => it === null || it === void 0 ? void 0 : it[`${PREFIX}programaid`]);
    const programResult = [];
    const handleCheck = (event, index) => {
        if (event.target.checked) {
            setRowsSelectedToExport([...rowsSelectedToExport, index]);
        }
        else {
            setRowsSelectedToExport(rowsSelectedToExport.filter((e) => e !== index));
        }
    };
    Object.keys(groupedPrograms).forEach((key, i) => {
        var _a;
        const itemArray = groupedPrograms[key];
        const firstItem = groupedPrograms[key][0];
        let peopleProgram = [];
        itemArray.forEach((elm) => {
            var _a, _b;
            const perProgram = (_a = dictPeople === null || dictPeople === void 0 ? void 0 : dictPeople[elm === null || elm === void 0 ? void 0 : elm[`programa_pessoa`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nomecompleto`];
            const funcProgram = (_b = dictTag === null || dictTag === void 0 ? void 0 : dictTag[elm === null || elm === void 0 ? void 0 : elm[`programa_funcao`]]) === null || _b === void 0 ? void 0 : _b[`${PREFIX}nome`];
            peopleProgram.push(`${perProgram || ''} ${funcProgram ? `(${funcProgram})` : ''}`);
        });
        programResult.push(Object.assign(Object.assign({}, firstItem), { selectRow: (React.createElement(FormControlLabel, { value: rowsSelectedToExport.includes(i), control: React.createElement(Checkbox, { color: 'primary', checked: rowsSelectedToExport.includes(i), value: rowsSelectedToExport.includes(i), onChange: (event) => handleCheck(event, i), name: 'sel' }), label: '' })), dateSchedule: moment(firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}data`]).format('DD/MM/YYYY'), programName: (_a = dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomeprograma`]]) === null || _a === void 0 ? void 0 : _a[`${PREFIX}nome`], program: {
                [`${PREFIX}NomePrograma`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}nomeprograma`]],
                [`${PREFIX}sigla`]: firstItem === null || firstItem === void 0 ? void 0 : firstItem[`programa_sigla`],
                [`${PREFIX}TipoPrograma`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}tipoprograma`]],
                [`${PREFIX}Instituto`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}instituto`]],
                [`${PREFIX}Empresa`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`${PREFIX}empresa`]],
                [`${PREFIX}Temperatura`]: dictTag[firstItem === null || firstItem === void 0 ? void 0 : firstItem[`programa_temperatura`]],
            }, peopleProgram: _.uniq(peopleProgram)
                .filter((e) => e === null || e === void 0 ? void 0 : e.trim())
                .join(', ') }));
    });
    return programResult;
};
//# sourceMappingURL=utils.js.map