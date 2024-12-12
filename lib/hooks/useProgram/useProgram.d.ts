import { IExceptionOption } from '../types';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { EGroups } from '~/config/enums';
interface IUseProgram {
    programs: any[];
    count: number;
    loading: boolean;
    postLoading: boolean;
    loadingSave: boolean;
    nextLink: string;
    updateProgram: (id: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    addOrUpdateProgram: (program: any, options?: IExceptionOption) => void;
    updateEnvolvedPerson: (id: any, programId: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    refetch: any;
    error: any;
}
interface IFilterProps {
    searchQuery?: string;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    createdBy?: string;
    group?: EGroups;
    rowsPerPage?: number;
    model?: boolean;
    typeProgram?: string;
    nameProgram?: string;
    institute?: string;
    company?: string;
}
declare const useProgram: (filter: IFilterProps, context?: WebPartContext) => IUseProgram[];
export default useProgram;
//# sourceMappingURL=useProgram.d.ts.map