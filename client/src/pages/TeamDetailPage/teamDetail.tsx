import React, { useState, useContext, useRef } from 'react';
import { Menu, Button, Tabs, Skeleton, Table, notification, Modal, Select, Avatar } from 'antd';
import { ExclamationCircleOutlined, EditFilled, UserDeleteOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { format } from 'date-fns';
import { ColumnsType } from 'antd/lib/table';
import { useMutation, useQuery } from '@apollo/client';

import { CaretDownFilled, PlusCircleOutlined } from '@ant-design/icons';
import AddMembersModal from './addMemberModal';
import { MemberQueries, TeamQueries } from '../../grapql-client/queries';
import { MemberMutations, TeamMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';
import EditTeamDetailModal from './editTeamDetailModal';

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { confirm } = Modal;
const { Option } = Select;

type Props = {
  teamId: number;
};

const TeamDetail = ({ teamId }: Props) => {
  const [isVisibleAddMemModal, setIsVisibleAddMemModal] = useState(false);
  const [isVisibleEditDetails, setIsVisibleEditDetails] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const me = useContext(SelfContext);
  const history = useHistory();

  const { loading, data } = useQuery(TeamQueries.getTeam, {
    variables: { teamId },
  });

  const [deleteTeam] = useMutation(TeamMutations.deleteTeam, {
    refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeam],
  });

  const operations = (
    <>
      <div className="flex flex-dir-r flex-ai-c flex-jc-c mb-10">
        <Button
          className="btn-delete-team mr-10"
          icon={<DeleteOutlined />}
          size="middle"
          onClick={() => {
            confirm({
              title: 'Are you sure want to delete this team?',
              icon: <ExclamationCircleOutlined />,
              centered: true,
              okText: 'Delete',
              onOk: async () => {
                await deleteTeam({ variables: { teamId } });
                history.push('/teams');
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          Delete Team
        </Button>
        <Button
          className="mr-10"
          icon={<PlusCircleOutlined />}
          size="middle"
          onClick={() => setIsVisibleAddMemModal(true)}
        >
          New Member
        </Button>
      </div>
    </>
  );

  const columns: ColumnsType<any> = [
    {
      title: 'Avatar',
      dataIndex: 'user',
      key: 'picture',
      render: function UserPicture(user: any) {
        return <Avatar src={user?.picture} />;
      },
    },
    {
      title: 'Name',
      dataIndex: 'user',
      key: 'name',
      render: (user: any) => {
        return user.name;
      },
    },
    {
      title: 'Email',
      align: 'center',
      dataIndex: 'user',
      key: 'email',
      render: (user: any) => user.email,
    },
    {
      title: 'Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: function hello(joinedAt: any) {
        return <>{format(new Date(+joinedAt), 'd MMM yyyy')}</>;
      },
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      key: 'assignedBy',
    },
    {
      title: 'Owner',
      dataIndex: 'isOwner',
      key: 'isOwner',
      render: (isOwner: any) => {
        return isOwner ? 'Yes' : 'No';
      },
    },
  ];

  if (data?.team?.ownerEmail.includes(me?.email)) {
    columns.push({
      title: '',
      align: 'center',
      key: 'tools',
      render: (member: any) => {
        const [isOwner, setIsOwner] = useState(member.isOwner);
        const prevIsOwner = useRef(isOwner);

        const [setRoleMember, { loading: setRoleLoading }] = useMutation(MemberMutations.SetRoleMember, {
          refetchQueries: [TeamQueries.getTeam],
        });

        const [removeMember, { loading: removeLoading }] = useMutation(MemberMutations.RemoveMember, {
          refetchQueries: [TeamQueries.getTeam],
        });

        const handleRemove = () => {
          removeMember({
            variables: { teamId, userId: member.user.id },
          });
        };

        return (
          <>
            {member.isOwner && data.team.members.filter((member: any) => member.isOwner).length <= 1 ? (
              <></>
            ) : (
              <>
                <Select
                  onSelect={(value: string) => setIsOwner(value === 'owner' ? true : false)}
                  defaultValue={isOwner ? 'owner' : 'member'}
                  style={{ width: 100, marginRight: '5px' }}
                >
                  <Option value="owner">Owner</Option>
                  <Option value="member">Member</Option>
                </Select>
                <Button
                  className="btn-delete-team mr-10"
                  disabled={isOwner === prevIsOwner.current}
                  loading={setRoleLoading}
                  size="middle"
                  onClick={() => {
                    setRoleMember({ variables: { teamId, userId: member.user.id, isOwner } });
                  }}
                >
                  Update
                </Button>
                <Button
                  className="btn-delete-team mr-10"
                  icon={<UserDeleteOutlined />}
                  size="middle"
                  loading={removeLoading}
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
                </Button>
              </>
            )}
          </>
        );
      },
    });
  }

  return (
    <div
      className="teamDetails site-layout-background flex flex-1 flex-dir-r"
      style={{ height: '100%', padding: '5px' }}
    >
      <div className="flex flex-2 flex-jc-sb" style={{ padding: 24, height: '100%' }}>
        <div className="flex flex-ai-c flex-jc-sb">
          <Avatar shape="square" size={250} src={data?.team?.picture}></Avatar>
          <div className="nameTeam" style={{ marginTop: '25px', height: 100, width: 500, overflow: 'hidden' }}>
            Team: {data?.team?.name}
          </div>
          <div>Description: {data?.team?.description}</div>
          <div style={{ marginTop: '20px' }}>
            {data?.team?.members.map((member: any) => {
              return (
                <Avatar style={{ marginRight: '3px' }} size="small" key={member.userId} src={member.user.picture} />
              );
            })}
          </div>
        </div>
        <div className="flex flex-ai-c flex-jc-c">
          <Button
            type="primary"
            shape="round"
            icon={<EditFilled />}
            size="large"
            onClick={() => setIsVisibleEditDetails(true)}
          >
            Edit Details
          </Button>
        </div>
      </div>
      <div
        className="flex-5 site-layout-background card-workspace"
        style={{
          padding: 24,
          height: '100%',
          boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      >
        <Tabs
          type="card"
          className="tab-inner"
          activeKey={activeKey}
          style={{ height: '100%' }}
          tabBarExtraContent={data?.team?.ownerEmail.includes(me?.email) && operations}
          onChange={(key: string) => {
            setActiveKey(key);
          }}
        >
          <TabPane tab="Member" key="1" className="flex flex-1 ">
            {loading ? (
              <Skeleton avatar paragraph={{ rows: 4 }} />
            ) : (
              <Menu defaultSelectedKeys={['1']} mode="inline">
                <SubMenu key="sub1" icon={<CaretDownFilled />} title="Owner">
                  <Table
                    rowKey={data?.team?.members.userId}
                    dataSource={data?.team?.members.filter((member: any) => member.isOwner)}
                    columns={columns}
                  />
                </SubMenu>
                <SubMenu key="sub2" icon={<CaretDownFilled />} title="Member">
                  <Table
                    rowKey={data?.team?.members.userId}
                    dataSource={data?.team?.members.filter((member: any) => !member.isOwner)}
                    columns={columns}
                  />
                </SubMenu>
              </Menu>
            )}
          </TabPane>
          <TabPane tab="Setting" key="2" className="flex " style={{ overflow: 'auto' }}>
            <div>hello</div>
          </TabPane>
          <TabPane tab="Analytics" key="3" className="flex " style={{ overflow: 'auto' }}>
            <div>Data</div>
          </TabPane>
        </Tabs>
        <AddMembersModal isVisible={isVisibleAddMemModal} teamId={teamId} setIsVisible={setIsVisibleAddMemModal} />
        <EditTeamDetailModal
          isVisible={isVisibleEditDetails}
          teamData={data?.team}
          setIsVisible={setIsVisibleEditDetails}
        />
      </div>
    </div>
  );
};

export default TeamDetail;
