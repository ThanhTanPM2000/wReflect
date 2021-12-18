import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Avatar, Button, Input, Modal, Upload, message, Card, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import { UserQueries } from '../../grapql-client/queries';
import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

import { UploadOutlined } from '@ant-design/icons';
import { user } from '../../apis';

const AccountSetting = () => {
  const me = useContext(SelfContext);
  const [updateAcctount, { data, loading }] = useMutation(UserMutations.updateUser, {});

  const handleFinish = (values: any) => {
    updateAcctount({ variables: { picture: values['email'] } });
    user.me();
  };

  return (
    <div className="profileUser">
      <div className="card-account">
        <div className="panelcont users row" style={{ padding: '0px', margin: '0px 0px 20px' }}>
          <h3 className="tname">Account Settings</h3>
        </div>
        <Form onFinish={handleFinish} layout="vertical">
          <div className="flex flex-dir-r" style={{ padding: '0 40px' }}>
            <div className="flex flex-5 flex-jc-c">
              <Form.Item
                name="email"
                hasFeedback
                label="Email"
                initialValue={me?.email}
                rules={[{ required: true, message: 'Please input your email' }]}
              >
                <Input disabled bordered placeholder={me?.email} type="text" value={me?.email} name="name" />
              </Form.Item>
            </div>
            <div className="flex flex-3 flex-ai-c flex-jc-c" style={{ alignContent: 'center' }}>
              <Form.Item
                rules={[{ required: true, message: 'Please input images' }]}
                initialValue={me?.profile?.picture}
                name="upload"
              >
                <div className="flex flex-jc-c flex-ai-c">
                  <Avatar size={64} src={me?.profile?.picture} icon={<UserOutlined />} />
                  <Upload
                    action="http://localhost:4000/api/upload"
                    name="photo"
                    multiple={false}
                    listType="picture"
                    className="flex flex-ai-c flex-jc-c"
                    maxCount={1}
                  >
                    <Button style={{ marginTop: '10px' }} icon={<UploadOutlined />}>
                      Upload
                    </Button>
                  </Upload>
                </div>
              </Form.Item>
            </div>
          </div>
          <div className="bar actions flex flex-dir-r flex-ai-c ">
            <Form.Item>
              <Button type="primary" htmlType="submit" className="flex flex-ai-c flex-jc-c">
                Save Changes
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AccountSetting;
