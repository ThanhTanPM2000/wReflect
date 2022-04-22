import { useQuery } from '@apollo/client';
import { Button } from 'antd';
import React, { useEffect } from 'react';
import { AssessmentQueries, TeamQueries } from '../../../grapql-client/queries';
import { Team } from '../../../types';
import { useHistory } from 'react-router-dom';

type Props = {
  teamId: string;
  assessmentId: string;
  setTeam: (value: Team) => void;
};

export default function AssessmentAnalysis({ teamId, assessmentId, setTeam }: Props) {
  const history = useHistory();

  const { data: teamData } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  useEffect(() => {
    setTeam(teamData?.team);
  }, [teamData]);

  const { data: assessmentData } = useQuery<AssessmentQueries.getAssessmentResult, AssessmentQueries.getAssessmentVars>(
    AssessmentQueries?.getAssessment,
    {
      variables: {
        teamId,
        assessmentId,
      },
    },
  );

  return (
    <div className="assessmentAnalysisPage">
      <div className="personalSection">
        <div className="assessmentTitle">{assessmentData?.getAssessment?.name}</div>
        <div className="actionDoPersionalReflection">
          <Button onClick={() => history?.push(`/personal-reflect/manage/${teamData?.team?.id}`)}>
            Back to Manage{' '}
          </Button>
          <Button>Modify Assessment</Button>
          <Button type="primary">Analysis</Button>
          <Button onClick={() => history?.push(`/personal-reflect/do/${teamId}/${assessmentId}`)}>
            Your Evaluation
          </Button>
          <Button>All Evaluation</Button>
        </div>
      </div>
      <div className="content flex"></div>
    </div>
  );
}
