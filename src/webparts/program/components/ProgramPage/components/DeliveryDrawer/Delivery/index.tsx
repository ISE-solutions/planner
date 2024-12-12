import * as React from 'react';
import {
  BoxDay,
  DeliveryContainer,
  DeliveryDayContainer,
  StyledIconButton,
} from './styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Divider,
  Chip,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Event, Edit, Delete } from '@material-ui/icons';
import * as moment from 'moment';
import { PREFIX } from '~/config/database';
import { useConfirmation } from '~/hooks';

interface DeliveryDrawerProps {
  delivery: any;
  onEdit: () => void;
  onDelete: () => void;
}

const deliveryDays = [
  {
    label: 'Grande Final',
    name: `${PREFIX}gradefinal`,
  },
  {
    label: 'Outlines',
    name: `${PREFIX}outlines`,
  },
  {
    label: 'Horários',
    name: `${PREFIX}horarios`,
  },
  {
    label: 'Aprovação',
    name: `${PREFIX}aprovacao`,
  },
  {
    label: 'Moodle/Pasta',
    name: `${PREFIX}moodlepasta`,
  },
  {
    label: 'Conferir Moodle',
    name: `${PREFIX}conferirmoodle`,
  },
];

const DeliveryCard: React.FC<DeliveryDrawerProps> = ({
  delivery,
  onEdit,
  onDelete,
}) => {
  const { confirmation } = useConfirmation();

  const handleDelete = () => {
    confirmation.openConfirmation({
      title: 'Confirmação de exclusão',
      description: 'Deseja realmente excluir essa entrega?',
      yesLabel: 'Sim',
      noLabel: 'Não',
      onConfirm: onDelete,
      onCancel: () => {},
    });
  };

  return (
    <Accordion>
      <Box sx={{ display: 'flex' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          style={{ flex: 1 }}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography color='primary' style={{ fontWeight: 'bold' }}>
            {delivery?.[`${PREFIX}titulo`]}
          </Typography>
        </AccordionSummary>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          paddingRight='4px'
        >
          <StyledIconButton>
            <Edit fontSize='small' onClick={onEdit} />
          </StyledIconButton>
          <StyledIconButton>
            <Delete fontSize='small' onClick={handleDelete} />
          </StyledIconButton>
        </Box>
      </Box>

      <AccordionDetails>
        <DeliveryContainer>
          <Typography>Dias das Entregas</Typography>
          <Box
            marginBottom='1rem'
            display='flex'
            style={{ gap: '10px' }}
            flexWrap='wrap'
          >
            {delivery?.[`${PREFIX}Entrega_CronogramadeDia`]?.map((day) => {
              return (
                <Chip
                  label={moment.utc(day?.[`${PREFIX}data`]).format('DD/MM/YYYY')}
                  color='primary'
                />
              );
            })}
          </Box>

          <Divider style={{ margin: '10px 0' }} />

          <Box
            display='flex'
            width='100%'
            padding='1rem'
            flexDirection='column'
            style={{ gap: '10px' }}
          >
            {deliveryDays.map((da) => (
              <BoxDay>
                <Typography>{da.label}</Typography>
                <DeliveryDayContainer>
                  <Event fontSize='small' />
                  <Typography variant='body1'>
                    {moment(delivery?.[da.name]).format('DD/MM/YYYY')}
                  </Typography>
                </DeliveryDayContainer>
              </BoxDay>
            ))}
          </Box>
        </DeliveryContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default DeliveryCard;
