import React, { useState, useContext, useRef } from 'react';
import { Menu, Button, Tabs, Skeleton, Dropdown, List, Modal, Avatar } from 'antd';
import { ExclamationCircleOutlined, EditFilled, DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

import { useMutation, useQuery, useLazyQuery } from '@apollo/client';

import { PlusCircleOutlined, MoreOutlined } from '@ant-design/icons';
import AddMembersModal from './addMemberModal';
import { TeamQueries } from '../../grapql-client/queries';
import { MemberMutations, TeamMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';
import EditTeamDetailModal from './editTeamDetailModal';

import ListMember from './listMember';
import SearchBar from '../../components/SearchBar/SearchBar';

const { TabPane } = Tabs;
const { confirm } = Modal;

type Props = {
  teamId: number;
};

const TeamDetail = ({ teamId }: Props) => {
  const [isVisibleAddMemModal, setIsVisibleAddMemModal] = useState(false);
  const [isVisibleEditDetails, setIsVisibleEditDetails] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeKey, setActiveKey] = useState('1');
  const me = useContext(SelfContext);
  const history = useHistory();

  const { loading, data } = useQuery(TeamQueries.getTeam, {
    variables: { teamId },
  });

  const [deleteTeam] = useMutation(TeamMutations.deleteTeam, {
    refetchQueries: [TeamQueries.getTeams, TeamQueries.getTeam],
  });

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
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

  return (
    <div
      className="teamDetails site-layout-background flex flex-1 flex-dir-r"
      style={{ height: '100%', padding: '5px' }}
    >
      <div className="flex flex-2 flex-jc-sb" style={{ padding: 24, height: '100%' }}>
        <div className="flex flex-ai-c flex-jc-sb">
          <Avatar shape="square" size={250} src={data?.team?.picture}></Avatar>
          <div className="flex flex-ai-c flex-jc-sb nameTeam" style={{ marginTop: '25px', height: 100, width: 500, overflow: 'hidden' }}>
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
              <>
                <SearchBar onHandleSearch={handleSearch} isLoading={loading} placeholder="Find members" />
                <ListMember
                  team={data?.team}
                  data={data?.team?.members.filter((member: any) => member?.user.email.includes(searchText))}
                />
              </>
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
