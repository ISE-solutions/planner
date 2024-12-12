import * as React from 'react';
import { Box, FormControl, FormHelperText, TextField } from '@material-ui/core';
const Observation = ({ formik }) => {
    var _a, _b;
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { overflow: 'hidden auto', maxHeight: '25rem', minHeight: '19rem', flexGrow: 1 },
            React.createElement(FormControl, { fullWidth: true },
                React.createElement(TextField, { fullWidth: true, multiline: true, minRows: 3, inputProps: { maxLength: 2000 }, type: 'text', name: 'description', onChange: (nextValue) => formik.setFieldValue('description', nextValue.target.value), value: formik.values.description }),
                React.createElement(FormHelperText, null,
                    ((_b = (_a = formik === null || formik === void 0 ? void 0 : formik.values) === null || _a === void 0 ? void 0 : _a.description) === null || _b === void 0 ? void 0 : _b.length) || 0,
                    "/2000")))));
};
export default Observation;
//# sourceMappingURL=index.js.map