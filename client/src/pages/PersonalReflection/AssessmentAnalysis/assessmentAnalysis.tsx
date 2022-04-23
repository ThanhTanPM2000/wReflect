import { useLazyQuery, useQuery } from '@apollo/client';
import { Avatar, Button, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AnalysisQueries, AssessmentQueries, TeamQueries } from '../../../grapql-client/queries';
import { Evaluation, Team } from '../../../types';
import { useHistory } from 'react-router-dom';
import AreaRadarChart from './areaRadarChart';
import RosePlotChart from './rosePlotChart';
import GroupedBulletChart from './groupedBulletChart';
import selfContext from '../../../contexts/selfContext';

const { Option } = Select;

type Props = {
  teamId: string;
  assessmentId: string;
  setTeam: (value: Team) => void;
};

export default function AssessmentAnalysis({ teamId, assessmentId, setTeam }: Props) {
  const history = useHistory();
  const [evaluation, setEvaluation] = useState<Evaluation>();
  const me = useContext(selfContext);

  const { data: teamData } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(TeamQueries.getTeam, {
    variables: {
      teamId,
    },
  });

  const [getAnalyticData, { data: test }] = useLazyQuery<
    AnalysisQueries.getAnalysisAssessmentResult,
    AnalysisQueries.getAnalysisAssessmentVars
  >(AnalysisQueries?.getAnalysisAssessment);

  useEffect(() => {
    if (evaluation?.assessmentId) {
      getAnalyticData({
        variables: {
          teamId,
          assessmentId,
          memberId: evaluation?.assessorId,
        },
      });
    }
  }, [evaluation]);

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

  const iMember = teamData?.team?.members.find((member) => member.userId === me?.id);

  useEffect(() => {
    const evaluation =
      assessmentData?.getAssessment?.evaluations.find((x) => x?.assessorId === iMember?.id) ||
      assessmentData?.getAssessment?.evaluations[0];
    setEvaluation(evaluation);
  }, [assessmentData]);

  const handleSelectEvaluation = (value: string) => {
    setEvaluation(assessmentData?.getAssessment?.evaluations?.find((evalue) => evalue?.id === value));
  };

  const renderEvaluationOption = assessmentData?.getAssessment?.evaluations?.map((evaluation) => (
    <Option key={evaluation?.assessor?.user?.id} value={evaluation?.id}>
      <Avatar
        style={{ marginRight: '1px' }}
        size="default"
        shape="circle"
        src={<img src={evaluation?.assessor?.user?.picture} referrerPolicy="no-referrer" />}
      />
      <span className="ml-12">{evaluation?.assessor?.user?.nickname}</span>
    </Option>
  ));

  return (
    <div className="assessmentAnalysisPage">
      <div className="personalSection">
        <div className="assessmentTitle">{assessmentData?.getAssessment?.name}</div>
        <div className="actionDoPersionalReflection">
          <Button onClick={() => history?.push(`/personal-reflect/manage/${teamData?.team?.id}`)}>
            Back to Manage{' '}
          </Button>
          <Button type="primary">Analysis</Button>
          <Button onClick={() => history?.push(`/personal-reflect/do/${teamId}/${assessmentId}`)}>Evaluation(s)</Button>
        </div>
      </div>
      <div className="content flex">
        <div className="flex flex-dir-r flex-ai-c">
          <Select
            onSelect={handleSelectEvaluation}
            value={evaluation?.id}
            className="select"
            style={{ width: 300 }}
            size="large"
          >
            {[...(renderEvaluationOption || [])]}
          </Select>
        </div>

        <div className="content">
          <div className="areaRadarChart">
            <AreaRadarChart areaRadarData={test?.getAnalysisAssessment?.areaRadarChartData} />
          </div>
        </div>
        <div className="rosePlotChart content">
          <RosePlotChart rosePlotData={test?.getAnalysisAssessment?.rosePlotChartData} />
        </div>
        <div className="groupedBulletChart content">
          <GroupedBulletChart rosePlotData={test?.getAnalysisAssessment?.rosePlotChartData} />
        </div>
      </div>
    </div>
  );
}
