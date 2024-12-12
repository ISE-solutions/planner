export default (date) => {
    const hour = (date === null || date === void 0 ? void 0 : date.hours()) || 0;
    const min = (date === null || date === void 0 ? void 0 : date.minutes()) || 0;
    const sec = (date === null || date === void 0 ? void 0 : date.seconds()) || 0;
    return hour * 60 + min + sec / 60;
};
//# sourceMappingURL=index.js.map