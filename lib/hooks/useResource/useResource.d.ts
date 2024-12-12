import * as moment from 'moment';
interface IUseResource {
    resources: any[];
    count: number;
    loading: boolean;
    postLoading: boolean;
    nextLink: string;
    fetchResources: (ft: IFilterResourceProps) => void;
    addOrUpdateByActivities: (activities: any[]) => void;
    addOrUpdateByActivity: (activities: any) => void;
    deleteByActivity: (activity: any) => void;
    getResources: (filtro: IFilterResourceProps) => Promise<any>;
    refetch: any;
    error: any;
}
export interface IFilterResourceProps {
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    deleted?: boolean;
    rowsPerPage?: number;
    startDate?: moment.Moment;
    endDate?: moment.Moment;
    dayDate?: moment.Moment;
    people?: any[];
    spaces?: any[];
}
interface IOptions {
    manual?: boolean;
}
declare const useResource: (filter: IFilterResourceProps, options?: IOptions) => IUseResource[];
export default useResource;
//# sourceMappingURL=useResource.d.ts.map