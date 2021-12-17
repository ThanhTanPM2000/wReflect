import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Row, Tabs, Avatar, Button, Input, Modal, Upload, message, Card, Col } from 'antd';

import { UserQueries } from '../../grapql-client/queries';
import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

import { UploadOutlined, EditFilled } from '@ant-design/icons';

const { TextArea, Search } = Input;
const { TabPane } = Tabs;

const ProfileUser = () => {
  const me = useContext(SelfContext);
  const { loading, data } = useQuery(UserQueries.getUser, {
    variables: {
      userId: me?.id,
    },
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const profile = data?.user?.profile;

  const [disabled, setDisabled] = useState(false);
  const [desc, setDesc] = useState({
    introduction: '',
    interests: '',
    talents: '',
    firstName: '',
    lastName: '',
    gender: '',
    workplace: '',
    school: '',
    phoneNumbers: '',
  });
  const { introduction, talents, interests, firstName, lastName, gender, workplace, school, phoneNumbers } = desc;
  const onInputChange = (event: any) => {
    setDesc({
      ...desc,
      [event.target.name]: event?.target.value,
    });
  };
  const [updateProfile] = useMutation(UserMutations.updateUser, {
    refetchQueries: [UserQueries.getUser],
  });

  const key = 'updatable';
  const handleOk = (event: any) => {
    setDisabled(!disabled);
    event?.preventDefault();

    updateProfile({
      variables: {
        introduction: introduction,
        talents: talents,
        interests: interests,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        workplace: workplace,
        school: school,
        phoneNumber: phoneNumbers,
      },
    });
    setIsModalVisible(false);
    message.loading({ content: 'Loading...', key });
    setTimeout(() => {
      message.success({ content: 'Update infomation successfully', key, duration: 2 });
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div
      className="teamDetails site-layout-background flex flex-1 flex-dir-r"
      style={{ height: '100%', padding: '5px' }}
    >
      <Tabs style={{ flex: 1 }} type="card" className="tab-inner">
        <TabPane style={{ textAlign: 'center', marginTop: 21 }} key="0">
          <div style={{ background: 'white', height: 800, marginRight: 20 }}>
            <div className="flex flex-2 flex-jc-sb" style={{ padding: 24, height: '100%' }}>
              <div className="flex flex-ai-c flex-jc-sb">
                <Avatar
                  className="avatarSetting"
                  src={`${me?.picture}`}
                  style={{ height: 150, width: 150, marginTop: 20 }}
                />
                <div style={{ marginTop: 20, fontSize: 20 }}>
                  {profile?.firstName === 'firstName' || profile?.lastName === 'lastName' ? (
                    <div>Please help me edit name</div>
                  ) : (
                    <div>
                      {profile?.firstName} {profile?.lastName}
                    </div>
                  )}
                  <div>{me?.email}</div>
                </div>
              </div>
              <Row gutter={16} style={{ fontWeight: 'bold' }}>
                <Col span={12}>
                  <Card title="Work Palace" bordered={false}>
                    {profile?.workplace}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="School" bordered={false} style={{ fontWeight: 'bold' }}>
                    {profile?.school}
                  </Card>
                </Col>
                <Col span={16}>
                  <hr style={{ width: 540 }} />
                </Col>
                <Col span={12}>
                  <Card title="Gender" bordered={false} style={{ fontWeight: 'bold' }}>
                    {profile?.gender}
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="Phone Number" bordered={false} style={{ fontWeight: 'bold' }}>
                    {profile?.phoneNumbers}
                  </Card>
                </Col>
              </Row>
              <div className="flex flex-ai-c flex-jc-c">
                <Button type="primary" onClick={showModal} shape="round" icon={<EditFilled />} size="large">
                  Edit Detail
                </Button>
              </div>
            </div>
            <Modal title="Edit Profile" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <div style={{ alignItems: 'center', flex: 1 }}>
                <Avatar
                  className="avatarSetting"
                  src={`${me?.picture}`}
                  style={{ height: 100, width: 100, marginLeft: 180 }}
                />
              </div>
              <Upload {...props}>
                <Button style={{ marginLeft: 160, marginTop: 20 }} icon={<UploadOutlined />}>
                  Upload image
                </Button>
              </Upload>
              <div>
                First Name
                <Input
                  placeholder="First Name..."
                  onChange={onInputChange}
                  value={firstName}
                  name="firstName"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Last Name
                <Input
                  placeholder="Last Name..."
                  onChange={onInputChange}
                  value={lastName}
                  name="lastName"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10, display: 'grid' }}>
                Gender
                <Input
                  placeholder="Gender..."
                  onChange={onInputChange}
                  value={gender}
                  name="gender"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Work Place
                <Input
                  placeholder="Work Place..."
                  onChange={onInputChange}
                  value={workplace}
                  name="workplace"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                School
                <Input
                  placeholder="School..."
                  onChange={onInputChange}
                  value={school}
                  name="school"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Phone Number
                <Input
                  placeholder="Phone Number..."
                  onChange={onInputChange}
                  value={phoneNumbers}
                  name="phoneNumbers"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Introduction
                <TextArea
                  placeholder="Introduction..."
                  onChange={onInputChange}
                  value={introduction}
                  name="introduction"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Talents
                <TextArea
                  placeholder="Talents..."
                  onChange={onInputChange}
                  value={talents}
                  name="talents"
                  disabled={disabled}
                />
              </div>
              <div style={{ marginTop: 10 }}>
                Interests
                <TextArea
                  placeholder="Interests..."
                  onChange={onInputChange}
                  value={interests}
                  name="interests"
                  disabled={disabled}
                />
              </div>
            </Modal>
          </div>
        </TabPane>
      </Tabs>
      <div
        className="flex-2 site-layout-background card-workspace"
        style={{
          padding: 24,
          height: '100%',
          boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
        }}
      >
        <Tabs style={{ flex: 2 }} type="card" className="tab-inner">
          <TabPane tab="Introduce" key="1" className="flex flex-1">
            <div style={{ overflowX: 'hidden', overflowY: 'scroll', height: 650 }}>
              <Row gutter={16}>
                <Col span={24}>
                  <Card title="Introduction" bordered={false}>
                    {profile?.introduction}
                  </Card>
                </Col>
                <Col span={24}>
                  <Card title="Talents" bordered={false}>
                    {profile?.talents}
                  </Card>
                </Col>
                <Col span={24}>
                  <Card title="Interests" bordered={false}>
                    {profile?.interests}
                  </Card>
                </Col>
              </Row>
            </div>
          </TabPane>
          <TabPane tab="Portfolio" key="2" className="flex " style={{ overflow: 'auto' }}>
            <div>Portfolio</div>
          </TabPane>
          <TabPane tab="Team" key="3" className="flex " style={{ overflow: 'auto' }}>
            <div>Team</div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfileUser;
