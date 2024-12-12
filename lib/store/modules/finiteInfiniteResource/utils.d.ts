import { Moment } from 'moment';
import { TYPE_RESOURCE } from '~/config/enums';
export interface IFilterProps {
    searchQuery?: string;
    deleted?: boolean;
    startDeleted?: Moment;
    endDeleted?: Moment;
    active?: 'Todos' | 'Ativo' | 'Inativo';
    order?: 'desc' | 'asc';
    orderBy?: string;
    rowsPerPage?: number;
    top?: number;
    typeResource?: TYPE_RESOURCE.FINITO | TYPE_RESOURCE.INFINITO;
}
export declare const buildQuery: (filtro: IFilterProps) => string;
//# sourceMappingURL=utils.d.ts.map