import { IExceptionOption } from '../types';
import { TYPE_RESOURCE } from '~/config/enums';
interface IUseFiniteInfiniteResource {
    resources: any[];
    count: number;
    loading: boolean;
    postLoading: boolean;
    nextLink: string;
    addOrUpdateFiniteInfiniteResource: (finiteResource: any, options?: IExceptionOption) => void;
    bulkUpdateFiniteInfiniteResource: (toUpdate: any, options?: IExceptionOption) => void;
    desactiveFiniteInfiniteResource: (toUpdate: any, options?: IExceptionOption) => void;
    activeFiniteInfiniteResource: (toUpdate: any, options?: IExceptionOption) => void;
    deleteResource: (res: any, options?: IExceptionOption) => void;
    refetch: any;
    error: any;
}
interface IFilterProps {
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    rowsPerPage?: number;
    top?: number;
    typeResource?: TYPE_RESOURCE.FINITO | TYPE_RESOURCE.INFINITO;
}
interface IOptions {
    manual?: boolean;
}
declare const useFiniteInfiniteResource: (filter: IFilterProps, options?: IOptions) => IUseFiniteInfiniteResource[];
export default useFiniteInfiniteResource;
//# sourceMappingURL=useFiniteInfiniteResource.d.ts.map