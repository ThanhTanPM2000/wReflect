import React, { useState } from 'react';
import { Menu, Dropdown, Modal, Input, Avatar, Upload, Button, message } from 'antd';
import {
  DownOutlined,
  UserOutlined,
  TeamOutlined,
  StockOutlined,
  LogoutOutlined,
  SettingOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router';

type Props = {
  email: string | null;
  picture: string | null;
};

const DropDown = ({ email, picture }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const key = 'updatable';
  const handleOk = () => {
    setIsModalVisible(false);
    message.loading({ content: 'Loading...', key });
    setTimeout(() => {
      message.success({ content: 'Create new team successfully!', key, duration: 2 });
    }, 1000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const history = useHistory();
  const redirect = () => {
    history.push('/profileUser');
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

  const menu = (
    <Menu>
      <Menu.Item key="0" icon={<SmileOutlined />}>
        <a onClick={redirect}>My profile</a>
      </Menu.Item>
      <Menu.Item key="1" icon={<TeamOutlined />}>
        <a href="">My team</a>
      </Menu.Item>
      <Menu.Item key="2" icon={<StockOutlined />}>
        My Health Check
      </Menu.Item>
      <Menu.Item key="3" icon={<UserOutlined />} onClick={showModal}>
        Manage Acount
      </Menu.Item>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ alignItems: 'center', flex: 1 }}>
          <Avatar className="avatarSetting" src={`${picture}`} style={{ height: 100, width: 100, marginLeft: 180 }} />
        </div>
        <Upload {...props}>
          <Button style={{ marginLeft: 160, marginTop: 20 }} icon={<UploadOutlined />}>
            Upload image
          </Button>
        </Upload>
        <div>
          Name
          <Input placeholder="User Name..." />
        </div>
        <div style={{ marginTop: 10 }}>
          Email
          <Input placeholder="Email User..." value={`${email}`} disabled />
        </div>
        <div style={{ marginTop: 10 }}>
          Phone Number
          <Input placeholder="Phone Number..." />
        </div>
      </Modal>
      <Menu.Divider />
      <Menu.Item key="4" icon={<SettingOutlined />}>
        Setting
      </Menu.Item>
      <Menu.Item key="5" icon={<LogoutOutlined />}>
        LogOut
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <DownOutlined />
      </a>
    </Dropdown>
  );
};
export default DropDown;
