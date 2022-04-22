import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Tabs, Avatar, Tooltip, Button, Badge } from 'antd';
import { useMutation, useQuery } from '@apollo/client';
import { AssessmentQueries, TeamQueries } from '../../../grapql-client/queries';
import { Team } from '../../../types';
import CriteriaQuestionsList from './criteriaQuestionsList';
import selfContext from '../../../contexts/selfContext';
import _ from 'lodash';
import AvatarPersonalReflection from './avatarPersonalReflection';
import moment from 'moment';
import Countdown from '../../../components/CountDown/countdown';
import { useHistory } from 'react-router-dom';
import { AssessmentMutations } from '../../../grapql-client/mutations';

const { TabPane } = Tabs;

type Props = {
  teamId: string;
  assessmentId: string;
  setTeam: (value: Team) => void;
};

type memberAnswerType = {
  isDone: boolean;
  concerningMemberId: string;
  data: {
    assessmentOnCriteriaId: string;
    point: number;
    comment: string;
  }[];
};

export default function DoPersonalReflection({ teamId, assessmentId, setTeam }: Props) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [memberAnswerList, setMemberAnswerList] = useState<memberAnswerType[]>([]);
  const history = useHistory();
  const me = useContext(selfContext);

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

  const [submitPersonal] = useMutation<
    AssessmentMutations.submitDoPersonalResult,
    AssessmentMutations.submitDoPersonalVars
  >(AssessmentMutations?.submitDoPersonalReflection, {
    onError: (error) => {
      console.log(error);
    },
  });

  const iMember = teamData?.team?.members.find((member) => member.userId === me?.id);

  // useEffect(() => {
  //   const data = teamData?.team?.members?.map((member) => {
  //     const isDone = assessmentData?.getAssessment?.assessmentOnCriteriaList?.every(
  //       (x) =>
  //         x?.assessorOnAssessments?.find((y) => y?.assessorId == iMember?.id && y?.concerningMemberId == member?.id)
  //           ?.point,
  //     );
  //     return {
  //       isDone: isDone,
  //       concerningMemberId: member?.id,
  //       data: assessmentData?.getAssessment?.assessmentOnCriteriaList?.map((question) => {
  //         const assessorOnAssessment = question?.assessorOnAssessments?.find(
  //           (x) => x?.assessorId == iMember?.id && x?.concerningMemberId === member?.id,
  //         );
  //         return {
  //           assessmentOnCriteriaId: question?.id,
  //           point: assessorOnAssessment?.point || null,
  //           comment: assessorOnAssessment?.comment || null,
  //         };
  //       }),
  //     };
  //   });
  //   setMemberAnswerList(data);
  // }, []);

  useEffect(() => {
    // const data = teamData?.team?.members?.map((member) => {
    //   const isDone = assessmentData?.getAssessment?.assessmentOnCriteriaList?.every(
    //     (x) =>
    //       x?.assessorOnAssessments?.find((y) => y?.assessorId == iMember?.id && y?.concerningMemberId == member?.id)
    //         ?.point,
    //   );
    //   return {
    //     isDone: isDone,
    //     concerningMemberId: member?.id,
    //     data: assessmentData?.getAssessment?.assessmentOnCriteriaList?.map((question) => {
    //       const assessorOnAssessment = question?.assessorOnAssessments?.find(
    //         (x) => x?.assessorId == iMember?.id && x?.concerningMemberId === member?.id,
    //       );
    //       return {
    //         assessmentOnCriteriaId: question?.id,
    //         point: assessorOnAssessment?.point || null,
    //         comment: assessorOnAssessment?.comment || null,
    //       };
    //     }),
    //   };
    // });
    // setMemberAnswerList(data);
    const data = assessmentData?.getAssessment?.member.
  }, [assessmentData, teamData]);

  console.log('???', memberAnswerList);

  useEffect(() => {
    setIsCompleted(memberAnswerList?.every((x) => x?.isDone));
  }, [memberAnswerList]);

  const handleUpdateMemberAnswer = (value: memberAnswerType) => {
    const cloneMemberAnswerList = [
      ...memberAnswerList?.map((memberAnswer) => {
        if (memberAnswer?.concerningMemberId === value?.concerningMemberId) {
          return value;
        }
        return memberAnswer;
      }),
    ];
    setMemberAnswerList(cloneMemberAnswerList);
  };

  return (
    <div className="doPersonalReflection">
      <div className="personalSection">
        <div className="assessmentTitle">{assessmentData?.getAssessment?.name}</div>
        <div className="actionDoPersionalReflection">
          <Button onClick={() => history?.push(`/personal-reflect/manage/${teamData?.team?.id}`)}>
            Back to Manage{' '}
          </Button>
          <Button>Modify Assessment</Button>
          <Button onClick={() => history?.push(`/personal-reflect/analysis-assessment/${teamId}/${assessmentId}`)}>
            Analysis
          </Button>
          <Button type="primary">Your Evaluation</Button>
          <Button>All Evaluation</Button>
        </div>
      </div>
      <div className=" content flex">
        <div className="headerOfDoPersonalReflection">
          <div className="flex flex-dir-r flex-ai-c">
            <Avatar
              style={{ marginRight: '1px' }}
              size="default"
              shape="circle"
              src={<img src={me?.picture} referrerPolicy="no-referrer" />}
            />
            <div className="bold ml-12">({me?.nickname})</div>
          </div>

          <div className="bold">
            End after <Countdown endTime={+assessmentData?.getAssessment?.endDate?.valueOf() || moment().valueOf()} />
          </div>
          <div className="bold">Not Submit</div>
        </div>
        <Tabs
          style={{ height: '100%' }}
          tabBarExtraContent={{
            right: (
              <div style={{ margin: '0px 10px 0px 10px' }} className="actions">
                {
                  <Button
                    onClick={() =>
                      submitPersonal({
                        variables: {
                          teamId: teamId,
                          assessmentId: assessmentId,
                          assessorId: me?.id,
                          memberAnswer: memberAnswerList,
                        },
                      })
                    }
                    disabled={!isCompleted}
                  >
                    Submit
                  </Button>
                }
              </div>
            ),
          }}
          tabPosition="left"
        >
          {teamData?.team?.members?.map((member) => (
            <TabPane
              tab={<AvatarPersonalReflection member={member} memberAnswerList={memberAnswerList} />}
              key={`${member?.id}`}
            >
              <CriteriaQuestionsList
                key={member?.id}
                member={member}
                memberAnswerList={memberAnswerList}
                assessmentOnCriteriaList={assessmentData?.getAssessment?.assessmentOnCriteriaList}
                setMemberAnswerList={handleUpdateMemberAnswer}
              />
            </TabPane>
          ))}
        </Tabs>
        {/* </div> */}
      </div>
    </div>
  );
}
