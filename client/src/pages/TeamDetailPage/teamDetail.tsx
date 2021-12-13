import React, { useState, useContext, useRef } from 'react';
import { Menu, Button, Tabs, Skeleton, Table, notification, Modal, Select } from 'antd';
import { ExclamationCircleOutlined, UserDeleteOutlined, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { format } from 'date-fns';
import { ColumnsType } from 'antd/lib/table';
import { useMutation, useQuery } from '@apollo/client';

import { DownOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AddMembersModal from './addMemberModal';
import { MemberQueries, TeamQueries } from '../../grapql-client/queries';
import { MemberMutations, TeamMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

const { TabPane } = Tabs;
const { SubMenu } = Menu;
const { confirm } = Modal;
const { Option } = Select;

type Props = {
  teamId: number;
};

const TeamDetail = ({ teamId }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('1');
  const me = useContext(SelfContext);
  const history = useHistory();

  const { loading, data } = useQuery(TeamQueries.getTeam, {
    variables: { teamId },
  });

  const [addNewMember] = useMutation(MemberMutations.AddNewMember, {
    refetchQueries: [
      MemberQueries.getListMembers, // DocumentNode object parsed with gql
      TeamQueries.getTeams,
    ],
  });

  const [deleteTeam] = useMutation(TeamMutations.deleteTeam, {
    refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeam],
  });

  const showNotification = (data: any) => {
    const { success, errors } = data;
    success.map((suc: string) => {
      notification.success({
        message: 'Added Successfully',
        description: suc,
        placement: 'bottomLeft',
      });
    });
    errors.map((error: string) => {
      notification.error({
        message: 'Added failed',
        description: error,
        placement: 'bottomLeft',
      });
    });
  };

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
              onOk() {
                deleteTeam({ variables: { teamId } });
                history.push('/workspace');
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }}
        >
          Delete Team
        </Button>
        <Button className="mr-10" icon={<PlusCircleOutlined />} size="middle" onClick={() => setIsModalVisible(true)}>
          New Member
        </Button>
      </div>
    </>
  );

  const handleOk = async (values: string[]) => {
    console.log('my values', values);
    const { data } = await addNewMember({ variables: { emailUsers: values, teamId } });
    showNotification(data.addMember);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns: ColumnsType<any> = [
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
    <div className="site-layout-background card-workspace" style={{ padding: 24, height: '100%' }}>
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
              <SubMenu key="sub1" icon={<DownOutlined />} title="Owner">
                <Table
                  rowKey="id"
                  dataSource={data?.team?.members.filter((member: any) => member.isOwner)}
                  columns={columns}
                />
              </SubMenu>
              <SubMenu key="sub2" icon={<DownOutlined />} title="Member">
                <Table
                  rowKey="id"
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
      <AddMembersModal isVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
    </div>
  );
};

export default TeamDetail;
