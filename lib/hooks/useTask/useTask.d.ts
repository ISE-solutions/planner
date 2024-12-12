import { IExceptionOption } from '../types';
interface IUseTask {
    tasks: any[];
    count: number;
    loading: boolean;
    postLoading: boolean;
    nextLink: string;
    bulkAddTaks: (tasks: any[], options?: IExceptionOption) => Promise<any>;
    bulkUpdatePerson: (toUpdate: any, options?: IExceptionOption) => void;
    desactivePerson: (toUpdate: any, options?: IExceptionOption) => void;
    activePerson: (toUpdate: any, options?: IExceptionOption) => void;
    deletePerson: (toUpdate: any, options?: IExceptionOption) => any;
    refetch: any;
    error: any;
}
interface IOptions {
    manual?: boolean;
}
interface IFilterProps {
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    rowsPerPage?: number;
}
declare const useTask: (filter: IFilterProps, options?: IOptions) => IUseTask[];
export default useTask;
//# sourceMappingURL=useTask.d.ts.map