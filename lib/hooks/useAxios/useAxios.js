var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { makeUseAxios } from 'axios-hooks';
import axios from 'axios';
import { BUSINESS_UNITY, BASE_URL } from '../../config/constants';
import * as moment from 'moment';
const getToken = (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = (_a = sessionStorage === null || sessionStorage === void 0 ? void 0 : sessionStorage.getItem('dynamic365Token')) === null || _a === void 0 ? void 0 : _a.replace('undefined', '');
    const expiry = moment(localStorage.getItem('expiry'));
    const now = moment();
    if (!token || !expiry.isValid() || now.isAfter(expiry)) {
        const tokenProvider = yield context.aadTokenProviderFactory.getTokenProvider();
        token = yield tokenProvider.getToken(`https://${BUSINESS_UNITY}.crm2.dynamics.com`);
        sessionStorage.setItem('dynamic365Token', token);
        sessionStorage.setItem('expiry', moment().add(45, 'minutes').toISOString());
    }
    return token;
});
const useAxios = ({ context }) => {
    const axiosApi = axios.create({
        baseURL: BASE_URL,
        timeout: 10000000000000000,
    });
    axiosApi.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield getToken(context);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }), (error) => {
        console.error(error);
        return Promise.reject(error);
    });
    axiosApi.interceptors.response.use((response) => response, (error) => {
        console.log({ error });
        if (error.response && error.response.status === 200) {
            // Reload the page
            console.log('401 Unauthorized detected. Reloading the page...');
            window.location.reload();
        }
        return Promise.reject(error);
    });
    return makeUseAxios({
        axios: axiosApi,
    });
};
export default useAxios;
//# sourceMappingURL=useAxios.js.map