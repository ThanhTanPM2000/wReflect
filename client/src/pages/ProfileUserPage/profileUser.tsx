import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Row, Tabs, Avatar, Button, Input, Upload, message, Card, Col, Form } from 'antd';

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
  const handleSave = (event: any) => {
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

    message.loading({ content: 'Loading...', key });
    setTimeout(() => {
      message.success({ content: 'Update infomation successfully', key, duration: 2 });
    }, 2000);
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
    <div className="profileUser" style={{ height: '100%' }}>
      <div className="teamDetails flex flex-1 flex-dir-r" style={{ padding: '5px', marginBottom: '50px' }}>
        <div style={{ flex: 1 }} className="tab-inner">
          <div style={{ marginTop: 21 }}>
            <div
              className="flex-2 site-layout-background card-workspace"
              style={{
                background: 'white',
                height: 730,
                marginRight: 20,
                boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
              }}
            >
              <div className="flex flex-ai-c flex-jc-sb">
                <Avatar
                  className="avatarSetting"
                  src={`${me?.picture}`}
                  style={{ height: 150, width: 150, marginTop: 20 }}
                />
                <Upload {...props}>
                  <Button style={{ marginTop: 20 }} icon={<UploadOutlined />}>
                    Edit image
                  </Button>
                </Upload>
              </div>
              <div className="flex flex-jc-sb" style={{ margin: '10px 100px 0px 0px' }}>
                <Form
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  initialValues={{ remember: true }}
                  autoComplete="off"
                >
                  <Form.Item label="School" name="School">
                    <Input placeholder="School..." onChange={onInputChange} value={school} name="school" />
                  </Form.Item>
                  <Form.Item label="Work Place" name="Work Place">
                    <Input placeholder="Work Place..." onChange={onInputChange} value={workplace} name="workplace" />
                  </Form.Item>
                  <Form.Item label="Phone Number" name="Phone Number">
                    <Input
                      placeholder="Phone Number..."
                      onChange={onInputChange}
                      value={phoneNumbers}
                      name="phoneNumbers"
                    />
                  </Form.Item>
                  <Form.Item label="Gender" name="Gender">
                    <Input placeholder="Gender..." onChange={onInputChange} value={gender} name="gender" />
                  </Form.Item>
                  <Form.Item label="Team" name="Team"></Form.Item>
                </Form>
                {window.location.pathname + window.location.search === '/me' ? (
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    onClick={handleSave}
                    style={{ position: 'relative', left: '50%', marginTop: '20px', width: '110px' }}
                  >
                    Save
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: '1100px', padding: '20px' }}>
          <div
            className="flex-2 site-layout-background card-workspace"
            style={{
              padding: 24,
              height: '350px',
              marginBottom: '30px',
              boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
            }}
          >
            <div style={{ flex: 2 }} className="tab-inner">
              <div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Card title="Introduction" bordered={false}>
                      <TextArea rows={8}>{profile?.introduction}</TextArea>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div
            className="flex-2 site-layout-background card-workspace"
            style={{
              padding: 24,
              height: '350px',
              boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
              overflowY: 'scroll',
              overflowX: 'hidden'
            }}
          >
            <div style={{ flex: 3 }} className="tab-inner">
              <div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Card title="Talents" bordered={false}>
                      <TextArea rows={4}>{profile?.talents}</TextArea>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="Interests" bordered={false}>
                      <TextArea rows={4}>{profile?.interests}</TextArea>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
