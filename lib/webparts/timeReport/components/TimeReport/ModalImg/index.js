var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, TextField, } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { PREFIX } from '~/config/database';
import { useSelector } from 'react-redux';
const ModalImg = ({ onClose, generatePDF, language, setLanguage, open, }) => {
    const [leftImg, setLeftImg] = React.useState('');
    const [rightImg, setRightImg] = React.useState('');
    const [centerImg, setCenterImg] = React.useState('');
    const [defaultImg, setDefaultImg] = React.useState(0);
    const { app } = useSelector((state) => state);
    const { images, context } = app;
    const loadSharepointImage = (img) => {
        if (!img)
            return null;
        if (img.serverRelativeUrl) {
            return `${img.serverUrl}${img.serverRelativeUrl}`;
        }
        return `${context.pageContext.web.absoluteUrl}/Lists/Imagens/Attachments/${defaultImg}/${img.fileName}`;
    };
    function convertImageToBase64(imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(imageUrl);
            const blob = yield response.blob();
            // Create a promise to convert the blob to Base64 using FileReader
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // @ts-ignore
                    resolve(reader.result); // reader.result is the Base64 string
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob); // Converts blob to Base64 data URL
            });
        });
    }
    const handleGenerate = () => __awaiter(void 0, void 0, void 0, function* () {
        let left = leftImg;
        let right = rightImg;
        let center = centerImg;
        if (defaultImg) {
            const imgChoosed = images === null || images === void 0 ? void 0 : images.find((e) => e.Id === defaultImg);
            left = yield convertImageToBase64(loadSharepointImage(JSON.parse(imgChoosed === null || imgChoosed === void 0 ? void 0 : imgChoosed.Esquerda)));
            right = yield convertImageToBase64(loadSharepointImage(JSON.parse(imgChoosed === null || imgChoosed === void 0 ? void 0 : imgChoosed.Direita)));
            center = yield convertImageToBase64(loadSharepointImage(JSON.parse(imgChoosed === null || imgChoosed === void 0 ? void 0 : imgChoosed.Centro)));
        }
        generatePDF({
            leftImg: left,
            rightImg: right,
            centerImg: center,
            language,
        });
        onClose();
        setLeftImg('');
        setRightImg('');
        setCenterImg('');
    });
    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            cb(reader.result);
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    };
    const handleImg = (event, setImg) => {
        getBase64(event.target.files[0], setImg);
    };
    return (React.createElement(Dialog, { open: open, onClose: onClose, maxWidth: 'md', fullWidth: true },
        React.createElement(DialogTitle, null, "Escolha as imagens"),
        React.createElement(DialogContent, null,
            React.createElement(Box, { display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', style: { gap: '1rem' } },
                React.createElement(Autocomplete, { fullWidth: true, filterSelectedOptions: true, options: [
                        {
                            value: `${PREFIX}nome`,
                            label: 'Português',
                        },
                        {
                            value: `${PREFIX}nomeen`,
                            label: 'Inglês',
                        },
                        {
                            value: `${PREFIX}nomees`,
                            label: 'Espanhol',
                        },
                    ], noOptionsText: 'Sem Op\u00E7\u00F5es', value: language, onChange: (event, newValue) => setLanguage(newValue), getOptionSelected: (option, item) => (option === null || option === void 0 ? void 0 : option.value) === (item === null || item === void 0 ? void 0 : item.value), getOptionLabel: (option) => (option === null || option === void 0 ? void 0 : option.label) || '', renderInput: (params) => (React.createElement(TextField, Object.assign({}, params, { fullWidth: true, label: 'Idioma' }))) }),
                React.createElement(Box, { display: 'flex', width: '100%', justifyContent: 'space-between' },
                    React.createElement(FormControl, { component: 'fieldset' },
                        React.createElement(RadioGroup, { value: defaultImg, onChange: (e) => setDefaultImg(+e.target.value) },
                            React.createElement(FormControlLabel, { value: 0, control: React.createElement(Radio, null), label: 'Customizado' }), images === null || images === void 0 ? void 0 :
                            images.map((im) => (React.createElement(FormControlLabel, { value: im.Id, control: React.createElement(Radio, null), label: im.Title }))))),
                    !defaultImg ? (React.createElement(Box, { display: 'flex', alignItems: 'center', style: { gap: '15px' } },
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', style: { gap: '15px' } },
                            React.createElement("input", { accept: 'image/png,  image/jpeg', style: { display: 'none' }, id: 'leftImg', type: 'file', onChange: (event) => handleImg(event, setLeftImg) }),
                            React.createElement("label", { htmlFor: 'leftImg' },
                                React.createElement(Button, { variant: 'contained', color: 'primary', component: 'span' }, "Esquerda")),
                            leftImg && (React.createElement("img", { src: leftImg, width: '120px', alt: 'Esquerda' }))),
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', style: { gap: '15px' } },
                            React.createElement("input", { accept: 'image/png,  image/jpeg', style: { display: 'none' }, id: 'centerImg', type: 'file', onChange: (event) => handleImg(event, setCenterImg) }),
                            React.createElement("label", { htmlFor: 'centerImg' },
                                React.createElement(Button, { variant: 'contained', color: 'primary', component: 'span' }, "Centro")),
                            centerImg && (React.createElement("img", { src: centerImg, width: '120px', alt: 'Centro' }))),
                        React.createElement(Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', style: { gap: '15px' } },
                            React.createElement("input", { accept: 'image/png,  image/jpeg', style: { display: 'none' }, id: 'rightImg', type: 'file', onChange: (event) => handleImg(event, setRightImg) }),
                            React.createElement("label", { htmlFor: 'rightImg' },
                                React.createElement(Button, { variant: 'contained', color: 'primary', component: 'span' }, "Direita")),
                            rightImg && (React.createElement("img", { src: rightImg, width: '120px', alt: 'Direita' }))))) : null))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: onClose, color: 'primary' }, "Cancelar"),
            React.createElement(Button, { onClick: handleGenerate, variant: 'contained', color: 'primary' }, "Gerar"))));
};
export default ModalImg;
//# sourceMappingURL=index.js.map