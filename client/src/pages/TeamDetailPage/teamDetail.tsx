import React, { useState, useContext, useRef } from 'react';
import { Input, Button, Tabs, Avatar, Upload, message, Row, Col } from 'antd';
import { EditFilled, UploadOutlined } from '@ant-design/icons';

import { useMutation, useQuery} from '@apollo/client';

import { TeamQueries } from '../../grapql-client/queries';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import config from '../../config';
import { TeamMutations } from '../../grapql-client/mutations';

import { Loading } from '../../components/Loading';
import { TopNavBar } from '../../components/TopNavBar';

const { TabPane } = Tabs;
const { TextArea } = Input;

type Props = {
  teamId: string;
};

const TeamDetail = ({ teamId }: Props) => {
  const { loading, data, error, refetch } = useQuery<TeamQueries.getTeamResult, TeamQueries.getTeamVars>(
    TeamQueries.getTeam,
    {
      variables: { teamId },
    },
  );

  const props = {
    beforeUpload: async (file: RcFile) => {
      if (file.type !== 'image/png') {
        message.error(`${file.name} is not a png file`);
      }
      return file.type === 'image/png' ? true : Upload.LIST_IGNORE;
    },
    onChange: (info: UploadChangeParam<UploadFile<any>>) => {
      console.log(info.fileList);
    },
  };

  return (
    <>
      <TopNavBar team={data?.team} title="Team Details" />
      <Loading refetch={refetch} data={data?.team} loading={loading} error={error}>
        <div
          className="teamDetails site-layout-background flex flex-1 flex-dir-r"
          style={{ height: '100%', padding: '5px' }}
        >
          <>
            <div className="flex flex-2 " style={{ padding: '48px 0 0', height: '100%' }}>
              <div className="team-settings" style={{ padding: 0, margin: '0px 30px 20px' }}>
                {' '}
                <h2>Team Settings</h2>
              </div>
              <Row style={{ paddingTop: 0, marginRight: 0 }}>
                <Col span={8}>
                  <div className="flex flex-ai-c flex-jc-sb">
                    <Avatar shape="circle" size={250} src={data?.team?.picture}></Avatar>
                    <Upload
                      action={`${config.SERVER_BASE_URL}/api/upload`}
                      name="photo"
                      multiple={false}
                      withCredentials={true}
                      listType="picture"
                      maxCount={1}
                      {...props}
                    >
                      <Button style={{ marginTop: 20 }} size="large" shape="round" icon={<UploadOutlined />}>
                        Upload
                      </Button>
                    </Upload>
                  </div>
                </Col>
                <Col span={16}>
                  <div className="flex">
                    <div className="flex nameTeam" style={{ fontSize: 20, marginBottom: 10}}>
                      <h5>Team Name</h5>
                      <Input defaultValue={data?.team?.name} />
                    </div>
                    <div className="flex nameTeam" style={{ fontSize: 20, marginBottom: 10}}>
                      <h5>Description</h5>
                      <TextArea style={{ height: 108}} defaultValue={data?.team?.description || undefined} />
                    </div>

                    <div style={{marginTop: 20 }} className="flex">
                      <hr style={{ marginBottom: 20}} />
                      <Button
                        shape="round"
                        icon={<EditFilled />}
                        size="large"
                        style={{ width: 'fit-content', margin: '0 0 0 auto' }}
                        // onClick={() => setIsVisibleEditDetails(true)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </>
        </div>
      </Loading>
    </>
  );
};

export default TeamDetail;