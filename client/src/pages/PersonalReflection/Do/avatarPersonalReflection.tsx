import { Avatar, Badge, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { Member } from '../../../types';
import { CheckCircleTwoTone } from '@ant-design/icons';

type memberAnswerType = {
  isDone: boolean;
  concerningMemberId: string;
  data: {
    assessmentOnCriteriaId: string;
    point: number;
    comment: string;
  }[];
};

type Props = {
  member: Member;
  memberAnswerList: memberAnswerType[];
};

export default function AvatarPersonalReflection({ member, memberAnswerList }: Props) {
  return (
    <>
      <Tooltip title={member?.user?.nickname} placement="top">
        <div
          className="flex flex-jc-c flex-ai-c"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'flex-end',
          }}
        >
          <Avatar
            style={{ marginRight: '1px' }}
            size="default"
            shape="circle"
            key={member?.user?.email}
            src={<img src={member?.user?.picture} referrerPolicy="no-referrer" />}
          />
          {memberAnswerList?.find((x) => x?.concerningMemberId === member?.id)?.isDone && (
            <div style={{ width: '15px', display: 'flex', flexDirection: 'row-reverse', position: 'absolute' }}>
              <CheckCircleTwoTone style={{ color: '#F79C2D', fontSize: '15px' }} />
            </div>
          )}
        </div>
      </Tooltip>
    </>
  );
}
