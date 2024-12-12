export const setValue = (type, data) => {
    return {
        type,
        payload: {
            data,
            loading: data ? false : true,
        },
    };
};
//# sourceMappingURL=common.js.map