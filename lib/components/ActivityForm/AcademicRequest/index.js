import * as React from 'react';
import { v4 } from 'uuid';
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, } from '@material-ui/core';
import { Add, Delete, Edit, Info } from '@material-ui/icons';
import Detail from './Detail';
import ModalForm from './ModalForm';
const AcademicRequest = ({ canEdit, values: activityValues, setFieldValue, setAcademicChanged, detailApproved, }) => {
    var _a, _b;
    const [isEditing, setIsEditing] = React.useState(false);
    const [modalDetail, setModalDetail] = React.useState({
        open: false,
        item: null,
    });
    const [modalForm, setModalForm] = React.useState(false);
    const [itemSelected, setItemSelected] = React.useState();
    const handleRemoveRequest = (keyId) => {
        let newRequests = activityValues.academicRequests || [];
        newRequests = newRequests === null || newRequests === void 0 ? void 0 : newRequests.map((e) => e.keyId === keyId ? Object.assign(Object.assign({}, e), { deleted: true }) : e);
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
            newRequests[index] = Object.assign(Object.assign({}, item), { keyId: item.keyId, people: item.people, description: item.description, deadline: item.deadline, delivery: item.delivery, link: item.link, nomemoodle: item.nomemoodle, other: item.other, equipments: item.equipments, observation: item.observation, finiteResource: item.finiteResource, infiniteResource: item.infiniteResource, deliveryDate: item.deliveryDate });
        }
        else {
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
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'baseline' },
        React.createElement(ModalForm, { open: modalForm, academicRequest: itemSelected, onSave: handleSave, onClose: () => {
                setIsEditing(false);
                setItemSelected(null);
                setModalForm(false);
            }, detailApproved: detailApproved, canEdit: canEdit, setFieldValue: setFieldValue }),
        React.createElement(Button, { variant: 'contained', color: 'primary', disabled: detailApproved || !canEdit, onClick: () => setModalForm(true), startIcon: React.createElement(Add, null) }, "Novo"),
        React.createElement(Box, { marginTop: '2rem', width: '100%' },
            React.createElement(TableContainer, { component: Paper },
                React.createElement(Table, { "aria-label": 'simple table' },
                    React.createElement(TableHead, null,
                        React.createElement(TableRow, null,
                            React.createElement(TableCell, null, "Descri\u00E7\u00E3o"),
                            React.createElement(TableCell, { style: { width: '12rem' } }, "A\u00E7\u00F5es"))),
                    React.createElement(TableBody, null, (_b = (_a = activityValues.academicRequests) === null || _a === void 0 ? void 0 : _a.filter((e) => !e.deleted)) === null || _b === void 0 ? void 0 : _b.map((row) => (React.createElement(TableRow, { key: row.keyId },
                        React.createElement(TableCell, { component: 'th', scope: 'row' }, row.description),
                        React.createElement(TableCell, { style: { width: '12rem' } },
                            React.createElement(IconButton, { onClick: () => handleOpenDetail(row) },
                                React.createElement(Tooltip, { arrow: true, title: 'Detalhar' },
                                    React.createElement(Info, null))),
                            React.createElement(IconButton, { disabled: detailApproved || !canEdit, onClick: () => handleEdit(row) },
                                React.createElement(Tooltip, { arrow: true, title: 'Editar' },
                                    React.createElement(Edit, null))),
                            React.createElement(IconButton, { disabled: detailApproved || !canEdit, onClick: () => handleRemoveRequest(row.keyId) },
                                React.createElement(Tooltip, { arrow: true, title: 'Remover' },
                                    React.createElement(Delete, null))))))))))),
        React.createElement(Detail, { open: modalDetail.open, item: modalDetail.item, handleClose: handleCloseDetail })));
};
export default AcademicRequest;
//# sourceMappingURL=index.js.map