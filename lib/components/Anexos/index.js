import { DeleteRounded, SaveAltRounded } from '@material-ui/icons';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, TableBody, TableCell, TableHead, Table as TableMaterial, TableRow, CircularProgress, Button, } from '@material-ui/core';
import * as React from 'react';
import * as _ from 'lodash';
import fileSize from './../../utils/fileSize';
import downloadFile from '../../utils/downloadFile';
const Transition = React.forwardRef((props, ref) => (
// @ts-ignore
React.createElement(Slide, Object.assign({ direction: 'up', ref: ref }, props))));
const Anexo = React.forwardRef(({ anexos, disabled, label, variant, id, justify, canRemove = true, accept = '*', maxLength, maxSize, }, ref) => {
    const [arquivos, setArquivos] = React.useState([]);
    const [modal, setModal] = React.useState({ open: false, item: {} });
    React.useImperativeHandle(ref, () => ({
        getAnexos() {
            return arquivos;
        },
    }));
    React.useEffect(() => {
        setArquivos(anexos || []);
    }, [anexos]);
    const addAnexo = (event) => {
        let newFiles = _.cloneDeep(arquivos);
        if (maxLength &&
            newFiles.filter((e) => !e.deveExcluir).length >= maxLength) {
            return;
        }
        const { files } = event.target;
        // @ts-ignore
        Array.from(files).forEach((file) => {
            if (!(maxSize && file.size > maxSize)) {
                newFiles.push({ nome: file.name, tamanho: file.size, file: file });
            }
        });
        setArquivos(newFiles);
    };
    const confirmDelete = (item) => {
        setModal(Object.assign(Object.assign({}, modal), { open: true, item }));
    };
    const handleClose = () => {
        setModal({ open: false, item: {} });
    };
    const deleteAnexo = (index) => {
        let anexos = _.cloneDeep(arquivos);
        anexos[index].deveExcluir = true;
        setArquivos(anexos);
        handleClose();
    };
    const downloadAnexo = (item, index) => {
        let anexos = _.cloneDeep(arquivos);
        anexos[index].loading = true;
        setArquivos(anexos);
        downloadFile(item.relativeLink, item.nome).then(() => {
            let anexos = _.cloneDeep(arquivos);
            anexos[index].loading = false;
            setArquivos(anexos);
        });
    };
    return (React.createElement(Grid, { ref: ref, key: id, 
        // @ts-ignore
        justify: justify || 'center', direction: 'column', container: true, spacing: 2 },
        arquivos.length ? (React.createElement(Grid, { item: true, style: { width: '100%' } },
            React.createElement(TableMaterial, { size: 'small' },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, null, "Nome"),
                        React.createElement(TableCell, null, "Tamanho"),
                        React.createElement(TableCell, null, "A\u00E7\u00F5es"))),
                React.createElement(TableBody, null, arquivos === null || arquivos === void 0 ? void 0 : arquivos.map((item, index) => (React.createElement(TableRow, { style: item.deveExcluir && { backgroundColor: '#e0e0e0' }, key: index },
                    React.createElement(TableCell, { style: item.deveExcluir && { color: '#6C6C6C' } }, item.nome),
                    React.createElement(TableCell, { style: item.deveExcluir && { color: '#6C6C6C' } }, fileSize(item.tamanho)),
                    React.createElement(TableCell, null,
                        React.createElement(Grid, { container: true, spacing: 1, style: { flexWrap: 'nowrap' }, justify: 'flex-start' },
                            !item.deveExcluir && canRemove && !disabled && (React.createElement(Grid, { item: true },
                                React.createElement(DeleteRounded, { onClick: () => confirmDelete({ nome: item.nome, index: index }), style: { color: '#33485d', cursor: 'pointer' } }))),
                            item.relativeLink && (React.createElement(Grid, { item: true }, item.loading ? (React.createElement(CircularProgress, { size: 20, style: { color: '#33485d' } })) : (React.createElement(SaveAltRounded, { onClick: () => downloadAnexo(item, index), style: { color: '#33485d', cursor: 'pointer' } }))))))))))))) : null,
        React.createElement(Grid, { item: true, style: { display: 'flex', justifyContent: 'center' } },
            React.createElement(Button, { color: 'primary', 
                // @ts-ignore
                variant: variant || 'contained', disabled: disabled ||
                    (maxLength &&
                        arquivos.filter((e) => !e.deveExcluir).length >= maxLength), onClick: () => document.getElementById(`btn-anexo-${id}`).click() },
                label || 'Adicionar Anexo',
                React.createElement("input", { onChange: addAnexo, id: `btn-anexo-${id}`, type: 'file', accept: accept, multiple: true, style: { display: 'none' } }))),
        React.createElement(Dialog, { open: modal.open, 
            // @ts-ignore
            TransitionComponent: Transition, keepMounted: true, onClose: handleClose },
            React.createElement(DialogTitle, null, "Tem Certeza que deseja excluir o arquivo?"),
            React.createElement(DialogContent, null,
                React.createElement(DialogContentText, null, 
                //@ts-ignore
                modal.item.nome)),
            React.createElement(DialogActions, null,
                React.createElement(Button, { onClick: handleClose }, "N\u00E3o"),
                React.createElement(Button, { variant: 'contained', color: 'primary', 
                    // @ts-ignore
                    onClick: () => deleteAnexo(modal.item.index) }, "Sim")))));
});
export default Anexo;
//# sourceMappingURL=index.js.map