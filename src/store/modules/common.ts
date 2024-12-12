interface IResponse {
  type: any;
  payload: { data: any; loading: boolean };
}
export const setValue = (type: any, data: any): IResponse => {
  return {
    type,
    payload: {
      data,
      loading: data ? false : true,
    },
  };
};
