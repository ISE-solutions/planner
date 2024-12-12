import * as React from 'react';
import { Box } from '@material-ui/core';

import { StyledToggleButton, StyledToggleButtonGroup } from './styles';
import { useLoggedUser } from '~/hooks';
import { PREFIX } from '~/config/database';
import * as moment from 'moment';
import { STATUS_TASK } from '~/config/enums';

interface IFastFilter {
  formik: any;
}

const FastFilter: React.FC<IFastFilter> = ({ formik }) => {
  const { currentUser } = useLoggedUser();

  const handleToggleResponsible = (event, nextType) => {
    if (nextType === 'todas') {
      formik.setFieldValue('responsible', []);
    } else {
      formik.setFieldValue('responsible', [currentUser]);
    }
    formik.handleSubmit();
  };

  const handleToggleDelayed = (event, nextType) => {
    if (nextType === 'todas') {
      formik.setFieldValue('endForecastConclusion', '');
      formik.setFieldValue('status', []);
    } else {
      formik.setFieldValue('status', [
        {
          value: STATUS_TASK['Em Andamento'],
          label: STATUS_TASK[STATUS_TASK['Em Andamento']],
        },
        {
          value: STATUS_TASK['Não Iniciada'],
          label: STATUS_TASK[STATUS_TASK['Não Iniciada']],
        },
      ]);
      formik.setFieldValue(
        'endForecastConclusion',
        moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
      );
    }
    formik.handleSubmit();
  };

  const handleTogglStatus = (event, nextType) => {
    if (nextType === 'todas') {
      formik.setFieldValue('status', []);
    } else if (nextType === 'active') {
      formik.setFieldValue('status', [
        {
          value: STATUS_TASK['Em Andamento'],
          label: STATUS_TASK[STATUS_TASK['Em Andamento']],
        },
        {
          value: STATUS_TASK['Não Iniciada'],
          label: STATUS_TASK[STATUS_TASK['Não Iniciada']],
        },
      ]);
    } else {
      formik.setFieldValue('status', [
        {
          value: STATUS_TASK.Concluído,
          label: STATUS_TASK[STATUS_TASK.Concluído],
        },
      ]);
    }
    formik.handleSubmit();
  };

  return (
    <Box display='flex' style={{ gap: '5px' }}>
      <StyledToggleButtonGroup
        exclusive
        onChange={handleToggleResponsible}
        orientation='horizontal'
      >
        <StyledToggleButton
          value={'todas'}
          selected={!formik?.values?.responsible?.length}
        >
          Todas
        </StyledToggleButton>
        <StyledToggleButton
          value={currentUser?.[`${PREFIX}pessoaid`]}
          selected={formik?.values?.responsible?.find(
            (e) => e?.value === currentUser?.[`${PREFIX}pessoaid`]
          )}
        >
          Minhas
        </StyledToggleButton>
      </StyledToggleButtonGroup>

      <StyledToggleButtonGroup
        onChange={handleToggleDelayed}
        orientation='horizontal'
        exclusive
      >
        <StyledToggleButton
          value='todas'
          selected={!formik?.values?.endForecastConclusion}
        >
          Todas
        </StyledToggleButton>
        <StyledToggleButton
          value='delayed'
          selected={!!formik?.values?.endForecastConclusion}
        >
          Atrasadas
        </StyledToggleButton>
      </StyledToggleButtonGroup>

      <StyledToggleButtonGroup
        onChange={handleTogglStatus}
        orientation='horizontal'
        exclusive
      >
        <StyledToggleButton
          selected={!formik.values.status.length}
          value='todas'
        >
          Todas
        </StyledToggleButton>
        <StyledToggleButton
          selected={formik.values.status.length === 2}
          value='active'
        >
          Ativas
        </StyledToggleButton>
        <StyledToggleButton
          selected={formik.values.status.length === 1}
          value='concluded'
        >
          Concluídas
        </StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default FastFilter;
