import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { AssessmentOnCriteria, Member } from '../../../types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import CriteriaQuestion from './criteriaQuestion';
import { point } from '@antv/g2plot';
import _ from 'lodash';
import { CriteriaQueries } from '../../../grapql-client/queries';
import { setAnswerHealthCheck } from '../../../grapql-client/mutations/HealthCheckMutation';

type answerType = {
  assessmentOnCriteriaId: string;
  point: number;
  comment: string;
};

type memberAnswerType = {
  isDone: boolean;
  concerningMemberId: string;
  data: answerType[];
};

type Props = {
  member: Member;
  memberAnswerList: memberAnswerType[];
  setMemberAnswerList: (value: memberAnswerType) => void;
  assessmentOnCriteriaList: AssessmentOnCriteria[];
};

export default function CriteriaQuestionsList({
  member,
  memberAnswerList,
  assessmentOnCriteriaList,
  setMemberAnswerList,
}: Props) {
  const [memberAnswer, setMemberAnswer] = useState<memberAnswerType>();

  useEffect(() => {
    setMemberAnswer({
      ...memberAnswerList?.find((memberAnswer) => memberAnswer?.concerningMemberId === member?.id),
    });
  }, [memberAnswerList]);

  const handleSelected = (value: answerType) => {
    setMemberAnswerList({
      ...memberAnswer,
      isDone: memberAnswer?.data
        ?.filter((y) => y?.assessmentOnCriteriaId !== value?.assessmentOnCriteriaId)
        ?.every((x) => !_?.isNull(x?.point)),
      data: memberAnswer?.data?.map((answer) => {
        if (answer?.assessmentOnCriteriaId === value?.assessmentOnCriteriaId) {
          return value;
        }
        return answer;
      }),
    });
  };

  return (
    <>
      <div className="criteriaQuestionList">
        {assessmentOnCriteriaList?.map((criteriaQuestion) => {
          const answer: answerType = memberAnswer?.data?.find(
            (answer) => answer?.assessmentOnCriteriaId === criteriaQuestion?.id,
          );
          return (
            <>
              <div key={`${criteriaQuestion?.id}`}>
                <CriteriaQuestion
                  member={member}
                  answer={answer}
                  setAnswer={(value) => handleSelected(value)}
                  criteriaQuestion={criteriaQuestion}
                />
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
