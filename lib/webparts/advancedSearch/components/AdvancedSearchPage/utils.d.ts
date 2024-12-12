import * as React from 'react';
export declare const COLUMNS_GROUP: ({ rowData, rowsSelectedToExport, setRowsSelectedToExport, }: {
    rowData: any;
    rowsSelectedToExport: any;
    setRowsSelectedToExport: any;
}) => {
    0: ({
        name: string;
        id: string;
        label: React.JSX.Element;
        hideColumn: boolean;
        group: string;
        options: {
            display: boolean;
            download: boolean;
            sort: boolean;
            filter: boolean;
            draggable: boolean;
            setCellProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: string;
                    background: string;
                    zIndex: number;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: number;
                    background: string;
                    zIndex: number;
                };
            };
        };
    } | {
        name: string;
        id: string;
        label: string;
        group: string;
        options: {
            display: boolean;
            setCellProps: () => {
                style: {
                    padding: string;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    minWidth: string;
                };
            };
            download?: undefined;
            sort?: undefined;
            filter?: undefined;
            draggable?: undefined;
        };
        hideColumn?: undefined;
    })[];
    1: ({
        name: string;
        id: string;
        label: React.JSX.Element;
        hideColumn: boolean;
        group: string;
        options: {
            display: boolean;
            download: boolean;
            sort: boolean;
            filter: boolean;
            draggable: boolean;
            setCellProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: string;
                    background: string;
                    zIndex: number;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: number;
                    background: string;
                    zIndex: number;
                };
            };
        };
    } | {
        name: string;
        id: string;
        label: string;
        group: string;
        options: {
            display: boolean;
            setCellProps: () => {
                style: {
                    padding: string;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    minWidth: string;
                };
            };
            download?: undefined;
            sort?: undefined;
            filter?: undefined;
            draggable?: undefined;
        };
        hideColumn?: undefined;
    })[];
    2: ({
        name: string;
        id: string;
        label: React.JSX.Element;
        hideColumn: boolean;
        group: string;
        options: {
            display: boolean;
            download: boolean;
            sort: boolean;
            filter: boolean;
            draggable: boolean;
            setCellProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: string;
                    background: string;
                    zIndex: number;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: number;
                    background: string;
                    zIndex: number;
                };
            };
        };
    } | {
        name: string;
        id: string;
        label: string;
        group: string;
        options: {
            display: boolean;
            setCellProps: () => {
                style: {
                    padding: string;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    minWidth: string;
                };
            };
            download?: undefined;
            sort?: undefined;
            filter?: undefined;
            draggable?: undefined;
        };
        hideColumn?: undefined;
    })[];
    3: ({
        name: string;
        id: string;
        label: React.JSX.Element;
        hideColumn: boolean;
        group: string;
        options: {
            display: boolean;
            download: boolean;
            sort: boolean;
            filter: boolean;
            draggable: boolean;
            setCellProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: string;
                    background: string;
                    zIndex: number;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    whiteSpace: string;
                    position: string;
                    left: number;
                    background: string;
                    zIndex: number;
                };
            };
        };
    } | {
        name: string;
        id: string;
        label: string;
        group: string;
        options: {
            display: boolean;
            setCellProps: () => {
                style: {
                    padding: string;
                };
            };
            setCellHeaderProps: () => {
                style: {
                    minWidth: string;
                };
            };
            download?: undefined;
            sort?: undefined;
            filter?: undefined;
            draggable?: undefined;
        };
        hideColumn?: undefined;
    })[];
};
export declare const formatActivityRows: ({ activities, dictTag, dictPeople, dictSpace, rowsSelectedToExport, setRowsSelectedToExport, }: {
    activities: any;
    dictTag: any;
    dictPeople: any;
    dictSpace: any;
    rowsSelectedToExport: any;
    setRowsSelectedToExport: any;
}) => any[];
export declare const formatScheduleRows: ({ schedules, dictTag, dictPeople, rowsSelectedToExport, setRowsSelectedToExport, }: {
    schedules: any;
    dictTag: any;
    dictPeople: any;
    rowsSelectedToExport: any;
    setRowsSelectedToExport: any;
}) => any[];
export declare const formatTeamRows: ({ teams, dictTag, dictPeople, rowsSelectedToExport, setRowsSelectedToExport, }: {
    teams: any;
    dictTag: any;
    dictPeople: any;
    rowsSelectedToExport: any;
    setRowsSelectedToExport: any;
}) => any[];
export declare const formatProgramRows: ({ programs, dictTag, dictPeople, rowsSelectedToExport, setRowsSelectedToExport, }: {
    programs: any;
    dictTag: any;
    dictPeople: any;
    rowsSelectedToExport: any;
    setRowsSelectedToExport: any;
}) => any[];
//# sourceMappingURL=utils.d.ts.map