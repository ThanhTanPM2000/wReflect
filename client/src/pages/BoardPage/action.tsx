import { useMutation } from '@apollo/client';
import { notification, Select } from 'antd';
import React from 'react';
import { OpinionMutations } from '../../grapql-client/mutations';
import { Board, Column, Member, Opinion, OpinionStatus } from '../../types';

const { Option } = Select;

type Props = {
  iMember?: Member;
  board: Board;
  column: Column;
  opinion: Opinion;
};

export default function ActionComponent({ board, column, opinion }: Props) {
  const [updateOpinion] = useMutation<OpinionMutations.updateOpinionResult, OpinionMutations.updateOpinionVars>(
    OpinionMutations.updateOpinion,
    {
      onError: (error) => {
        notification.error({
          placement: 'bottomRight',
          message: error?.message,
        });
      },
    },
  );

  const handleRenderOptionMemberAssign = () => {
    return board.team.members.map((member) => (
      <Option key={member?.user?.id} value={member?.user?.id}>
        {member?.user?.nickname}
      </Option>
    ));
  };

  const handleSelectStatusOfAction = (value: string) => {
    updateOpinion({
      variables: {
        teamId: board.teamId,
        boardId: board.id,
        columnId: column.id,
        opinionId: opinion.id,
        status: value as OpinionStatus,
      },
    });
  };

  const handleSelectResponsible = (value: string) => {
    updateOpinion({
      variables: {
        teamId: board.teamId,
        boardId: board.id,
        columnId: column.id,
        opinionId: opinion.id,
        responsible: value,
      },
    });
  };

  return (
    <div className="opinionAction">
      <Select
        onSelect={handleSelectStatusOfAction}
        className="select"
        defaultValue={opinion?.status}
        style={{ width: 120 }}
      >
        <Option value="NEW">Open</Option>
        <Option value="IN_PROGRESS">In progress</Option>
        <Option value="DONE">Done</Option>
        <Option value="REJECTED">Rejected</Option>
      </Select>
      <Select
        onSelect={handleSelectResponsible}
        className="select"
        defaultValue={opinion.responsible}
        style={{ width: 120 }}
      >
        <Option value="not-assigned">Not Assigned</Option>
        {[...handleRenderOptionMemberAssign()]}
      </Select>
    </div>
  );
}
