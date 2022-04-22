import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';

import { QuestionCircleOutlined, MessageFilled, MessageOutlined } from '@ant-design/icons';
import { AssessmentOnCriteria, Member } from '../../../types';
import CommentModal from './commentModal';

type answerType = {
  assessmentOnCriteriaId: string;
  point: number;
  comment: string;
};

type Props = {
  member: Member;
  answer: answerType;
  setAnswer: (value: answerType) => void;
  criteriaQuestion: AssessmentOnCriteria;
};

export default function CriteriaQuestion({ member, answer, criteriaQuestion, setAnswer }: Props) {
  const [point, setPoint] = useState<number>(answer?.point);
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState<string | null>(answer?.comment);

  useEffect(() => {
    setPoint(answer?.point);
    setComment(answer?.comment);
  }, [answer]);

  useEffect(() => {
    setAnswer({ ...answer, point, comment });
  }, [point, comment]);

  return (
    <>
      <CommentModal
        member={member}
        criteriaQuestion={criteriaQuestion}
        isVisible={visible}
        setVisible={setVisible}
        comment={comment}
        setComment={setComment}
      />
      <div className="criteriaQuestion" key={`${criteriaQuestion?.assessmentId}${criteriaQuestion?.criteriaId}`}>
        <div className="criteriaHeader">
          {criteriaQuestion?.criteria?.name}
          <Tooltip trigger={['click']} placement="top" title={criteriaQuestion?.criteria?.description}>
            <QuestionCircleOutlined style={{ fontSize: '20px' }} />
          </Tooltip>
        </div>
        <div className="criteriaBody">
          <div className="questionPoint">
            <div style={{ cursor: 'pointer' }} className="num-wrapper poll-center-items">
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setPoint(1)}
                className={`num  orange ${point == 1 && 'is-selected'}`}
              >
                1
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setPoint(2)}
                className={`num blue ${point == 2 && 'is-selected'}`}
              >
                2
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setPoint(3)}
                className={`num purple ${point == 3 && 'is-selected'}`}
              >
                3
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setPoint(4)}
                className={`num lpink ${point == 4 && 'is-selected'}`}
              >
                4
              </span>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => setPoint(5)}
                className={`num green ${point == 5 && 'is-selected'}`}
              >
                5
              </span>
            </div>
          </div>
          <div className="actions">
            <div className="commentAction">
              {answer?.comment ? (
                <MessageFilled onClick={() => setVisible(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
              ) : (
                <MessageOutlined onClick={() => setVisible(true)} style={{ fontSize: '20px', cursor: 'pointer' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
