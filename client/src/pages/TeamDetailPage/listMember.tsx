import React, { useContext, useState, useRef } from 'react';

import { Button, Dropdown, Menu, Modal, List, Avatar, message } from 'antd';

import SelfContext from '../../contexts/selfContext';

import { ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';

import { useMutation } from '@apollo/client';
import { TeamQueries } from '../../grapql-client/queries';
import { MemberMutations } from '../../grapql-client/mutations';
import { Member, Team } from '../../types';
import config from '../../config';

type Props = {
  searchText: string;
  teamData: Team;
};

const { confirm } = Modal;

export default function ListMember({ searchText, teamData }: Props) {
  const me = useContext(SelfContext);

  const [setRoleMember] = useMutation(MemberMutations.SetRoleMember, {
    refetchQueries: [TeamQueries.getTeam],
  });

  const [removeMember] = useMutation(MemberMutations.RemoveMember, {
    refetchQueries: [TeamQueries.getTeam],
  });
  return (
    <div style={{ overflowX: 'hidden', overflowY: 'scroll', height: 700}}>
      <List
        dataSource={teamData?.members.filter((member: Member) => member?.email?.includes(searchText))}
        renderItem={(member: Member) => {
          const handleRemove = () => {
            removeMember({
              variables: { teamId: teamData?.id, email: member?.email },
            })
              .then((res) => message.success(`${member?.user?.email} successfully removed`))
              .catch((error) => message.error(error.message));
          };
          const menu = (
            <Menu>
              <Menu.Item
                key="1"
                onClick={() => {
                  setRoleMember({
                    variables: { teamId: teamData?.id, userId: member.user.id, isOwner: !member?.isOwner },
                  });
                }}
              >
                {member?.isOwner ? 'Withdraw Owner Rights' : 'Set Owner'}
              </Menu.Item>
              <Menu.Item key="2">View Profile</Menu.Item>
              <Menu.Item
                key="3"
                onClick={() => {
                  confirm({
                    title: 'Are you sure want to remove this member?',
                    icon: <ExclamationCircleOutlined />,
                    content: member.user.email,
                    centered: true,
                    okText: 'Remove',
                    onOk() {
                      handleRemove();
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                  });
                }}
              >
                Remove
              </Menu.Item>
            </Menu>
          );
          return (
            <List.Item
              key={`${member?.id}`}
              actions={[
                <Dropdown key="list-loadmore-edit" overlay={menu}>
                  <Button
                    type="text"
                    hidden={member?.email === me?.email || !teamData?.ownerEmail.includes(me?.email as string)}
                  >
                    <MoreOutlined />
                  </Button>
                </Dropdown>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={member?.user?.profile?.picture || `${config.SERVER_BASE_URL}/uploads/avatarDefault.png`}
                  />
                }
                // title={<a href="https://ant.design">{member?.  member?.user?.profile?.nickname || 'unknow'}</a>}
                title={
                  member?.status === 'JOINED' ? (
                    <a href="https://ant.design">{member?.user?.profile?.nickname || 'Unknown'}</a>
                  ) : (
                    'Pending Invitation'
                  )
                }
                description={member?.user?.email}
              />
              {member.isOwner && (
                <div
                  style={{
                    padding: '5px',
                    backgroundColor: '#979FA6',
                    borderRadius: '10px',
                    color: '#FFFFFF',
                    fontSize: '10px',
                  }}
                >
                  Owner
                </div>
              )}
            </List.Item>
          );
        }}
      />
    </div>
  );
}
