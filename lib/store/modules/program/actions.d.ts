import { IFilterProps } from './utils';
export declare const fetchAllPrograms: (filter: IFilterProps) => any;
export declare const fetchAdvancedPrograms: (filter: string) => any;
export declare const getPrograms: (filter: IFilterProps) => any;
export declare const getProgramId: (programId: any) => Promise<any>;
export declare const getProgramByIds: (programIds: string[]) => Promise<any>;
export declare const addOrUpdateProgram: (program: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}, temperatureChanged?: boolean, isUndo?: boolean) => any;
export declare const deleteProgram: (programId: string, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateProgram: (id: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const updateEnvolvedPerson: (id: any, programId: any, toSave: any, { onSuccess, onError }: {
    onSuccess: any;
    onError: any;
}) => any;
export declare const uploadProgramFiles: (program: any, programId: any, context: any) => Promise<unknown>;
//# sourceMappingURL=actions.d.ts.map