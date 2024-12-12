import * as React from 'react';
interface IListModels {
    modelChoosed: any;
    refetch: any;
    currentUser: any;
    loading: boolean;
    models: any[];
    filter: any;
    setFilter: React.Dispatch<any>;
    setSearch: any;
    handleSaveActivity: (item: any, onSuccess: any) => void;
    handleActivity: (actv: any) => any;
}
declare const ListModels: React.FC<IListModels>;
export default ListModels;
//# sourceMappingURL=index.d.ts.map