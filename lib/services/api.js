var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { BASE_URL } from '~/config/constants';
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000000000000000,
});
const getToken = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = (_a = sessionStorage === null || sessionStorage === void 0 ? void 0 : sessionStorage.getItem('dynamic365Token')) === null || _a === void 0 ? void 0 : _a.replace('undefined', '');
    return token;
});
api.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
}), (error) => {
    return Promise.reject(error);
});
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Reload the page
        console.log('401 Unauthorized detected. Reloading the page...');
        window.location.reload();
    }
    return Promise.reject(error);
});
export default api;
//# sourceMappingURL=api.js.map