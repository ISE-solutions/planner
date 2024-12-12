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
import { Box, CircularProgress, ThemeProvider } from '@material-ui/core';
import MomentUtils from '@date-io/moment';
import { Provider } from 'react-redux';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { NotificationProvider } from '~/providers/NotificationProvider';
import theme from '~/utils/theme';
import { ConfirmationProvider } from '~/providers/ConfirmationProvider';
import { ContextProvider } from '~/providers/ContextProvider';
import { UserProvider } from '~/providers/UserProvider';
import { UndoProvider } from '~/providers/UndoProvider';
import { store } from '~/store';
import { BUSINESS_UNITY } from '~/config/constants';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
const App = ({ context, children }) => {
    const [validToken, setValidToken] = React.useState(false);
    const intervalRef = React.useRef(null);
    React.useEffect(() => {
        intervalRef.current = setInterval(() => {
            checkToken();
        }, 5 * 60 * 1000);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, []);
    React.useEffect(() => {
        checkToken();
    }, []);
    const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
        const tokenProvider = yield context.aadTokenProviderFactory.getTokenProvider();
        const token = yield tokenProvider.getToken(`https://${BUSINESS_UNITY}.crm2.dynamics.com`);
        sessionStorage.setItem('dynamic365Token', token);
        setValidToken(true);
    });
    const checkToken = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let token = (_a = sessionStorage === null || sessionStorage === void 0 ? void 0 : sessionStorage.getItem('dynamic365Token')) === null || _a === void 0 ? void 0 : _a.replace('undefined', '');
        if (!token) {
            getToken();
        }
        else {
            const decode = JSON.parse(atob((token === null || token === void 0 ? void 0 : token.split('.')[1]) || ''));
            const expiry = (decode === null || decode === void 0 ? void 0 : decode.exp) - 1800;
            if (expiry < new Date().getTime()) {
                getToken();
            }
            else {
                setValidToken(true);
            }
        }
    });
    return (React.createElement(Provider, { store: store },
        React.createElement(ThemeProvider, { theme: theme },
            React.createElement(ContextProvider, { context: context },
                React.createElement(LocalizationProvider, { dateAdapter: AdapterMoment },
                    React.createElement(MuiPickersUtilsProvider, { utils: MomentUtils },
                        React.createElement(NotificationProvider, null,
                            React.createElement(UndoProvider, null, validToken ? (React.createElement(UserProvider, { context: context },
                                React.createElement(ConfirmationProvider, null, children))) : (React.createElement(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center' },
                                React.createElement(CircularProgress, { color: 'primary' })))))))))));
};
export default App;
//# sourceMappingURL=index.js.map