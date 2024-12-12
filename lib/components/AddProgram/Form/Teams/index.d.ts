import * as React from 'react';
interface ITeamsProps {
    teams: any[];
    isDetail: boolean;
    isSaved: boolean;
    refreshProgram: () => void;
    handleTeam: (team: any) => void;
}
declare const Teams: React.FC<ITeamsProps>;
export default Teams;
//# sourceMappingURL=index.d.ts.map