import * as React from 'react';
import { v4 } from 'uuid';
import * as _ from 'lodash';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@material-ui/core';
import { Add, Delete, Edit, Info } from '@material-ui/icons';
import Detail from './Detail';
import ModalForm from './ModalForm';

interface IAcademicRequestProps {
  canEdit: boolean;
  values: any;
  setFieldValue: any;
  setAcademicChanged: any;
  detailApproved: boolean;
}

const AcademicRequest: React.FC<IAcademicRequestProps> = ({
  canEdit,
  values: activityValues,
  setFieldValue,
  setAcademicChanged,
  detailApproved,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [modalDetail, setModalDetail] = React.useState<any>({
    open: false,
    item: null,
  });
  const [modalForm, setModalForm] = React.useState(false);
  const [itemSelected, setItemSelected] = React.useState();

  const handleRemoveRequest = (keyId) => {
    let newRequests = activityValues.academicRequests || [];
    newRequests = newRequests?.map((e) =>
      e.keyId === keyId ? { ...e, deleted: true } : e
    );

    setFieldValue('academicRequests', newRequests);
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setItemSelected(item);
    setModalForm(true);
  };

  const handleOpenDetail = (item) => {
    setModalDetail({ open: true, item });
  };

  const handleCloseDetail = () => {
    setModalDetail({ open: false, item: null });
  };

  const handleSave = (item) => {
    const newRequests = [...(activityValues.academicRequests || [])];

    if (isEditing) {
      const index = newRequests.findIndex((req) => req.keyId === item.keyId);
      newRequests[index] = {
        ...item,
        keyId: item.keyId,
        people: item.people,
        description: item.description,
        deadline: item.deadline,
        delivery: item.delivery,
        link: item.link,
        nomemoodle: item.nomemoodle,
        other: item.other,
        equipments: item.equipments,
        observation: item.observation,
        finiteResource: item.finiteResource,
        infiniteResource: item.infiniteResource,
        deliveryDate: item.deliveryDate,
      };
    } else {
      newRequests.push({
        keyId: v4(),
        people: item.people,
        description: item.description,
        deadline: item.deadline,
        delivery: item.delivery,
        link: item.link,
        nomemoodle: item.nomemoodle,
        other: item.other,
        equipments: item.equipments,
        observation: item.observation,
        finiteResource: item.finiteResource,
        infiniteResource: item.infiniteResource,
        deliveryDate: item.deliveryDate,
      });
    }

    setFieldValue('academicRequests', newRequests);
    setModalForm(false);
    setItemSelected(null);
    setIsEditing(false);
    setAcademicChanged(true);
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='baseline'>
      <ModalForm
        open={modalForm}
        academicRequest={itemSelected}
        onSave={handleSave}
        onClose={() => {
          setIsEditing(false);
          setItemSelected(null);
          setModalForm(false);
        }}
        detailApproved={detailApproved}
        canEdit={canEdit}
        setFieldValue={setFieldValue}
      />

      <Button
        variant='contained'
        color='primary'
        disabled={detailApproved || !canEdit}
        onClick={() => setModalForm(true)}
        startIcon={<Add />}
      >
        Novo
      </Button>

      <Box marginTop='2rem' width='100%'>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell style={{ width: '12rem' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activityValues.academicRequests
                ?.filter((e) => !e.deleted)
                ?.map((row) => (
                  <TableRow key={row.keyId}>
                    <TableCell component='th' scope='row'>
                      {row.description}
                    </TableCell>
                    <TableCell style={{ width: '12rem' }}>
                      <IconButton onClick={() => handleOpenDetail(row)}>
                        <Tooltip arrow title='Detalhar'>
                          <Info />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        disabled={detailApproved || !canEdit}
                        onClick={() => handleEdit(row)}
                      >
                        <Tooltip arrow title='Editar'>
                          <Edit />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        disabled={detailApproved || !canEdit}
                        onClick={() => handleRemoveRequest(row.keyId)}
                      >
                        <Tooltip arrow title='Remover'>
                          <Delete />
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Detail
        open={modalDetail.open}
        item={modalDetail.item}
        handleClose={handleCloseDetail}
      />
    </Box>
  );
};

export default AcademicRequest;
