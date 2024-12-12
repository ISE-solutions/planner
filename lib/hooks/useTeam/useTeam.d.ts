import { IExceptionOption } from '../types';
import { EGroups } from '~/config/enums';
interface IUseTeam {
    teams: any[];
    count: number;
    loading: boolean;
    loadingSave: boolean;
    postLoading: boolean;
    nextLink: string;
    addOrUpdateTeam: (team: any, programId: string, options?: IExceptionOption) => void;
    updateTeam: (id: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    updateEnvolvedPerson: (id: any, teamId: any, toSave: any, options?: IExceptionOption) => Promise<any>;
    getTeamByProgramId: (programId: any) => Promise<any>;
    getTeamById: (teamId: any) => Promise<any>;
    refetch: any;
    error: any;
}
interface IFilterProps {
    searchQuery?: string;
    programId?: string;
    filterProgram?: boolean;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    published?: 'Todos' | 'Sim' | 'Não';
    group?: EGroups;
    createdBy?: string;
    orderBy?: string;
    model?: boolean;
    rowsPerPage?: number;
    modality?: string;
    yearConclusion?: string;
    initials?: string;
}
interface IOptions {
    manual?: boolean;
}
declare const useTeam: (filter: IFilterProps, options?: IOptions) => IUseTeam[];
export default useTeam;
//# sourceMappingURL=useTeam.d.ts.map