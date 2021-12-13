import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router';
import { useMutation, useQuery } from '@apollo/client';

import { UserMutations } from '../../../../grapql-client/mutations';
import { UserQueries } from '../../../../grapql-client/queries';

import { Menu, Dropdown, Modal, Input, Avatar, Upload, Button, message, Select } from 'antd';
import {
  CaretDownOutlined,
  UserOutlined,
  TeamOutlined,
  StockOutlined,
  LogoutOutlined,
  SettingOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';

type Props = {
  email: string | null;
  picture: string | null;
};


const DropDown = ({ email, picture }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [disabled , setDisabled ] = useState(false)
  const [editUser] = useMutation(UserMutations.updateUser, {
    refetchQueries: [
      UserQueries.getUser
    ]
  })
  const [updateUser, setUpdateUser] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    workplace: '',
    school: '',
    phoneNumbers: '',
  });

  const { firstName, lastName, gender, workplace, school, phoneNumbers } = updateUser;
  
  const onInputChange = (event: any) => {
    setUpdateUser({
      ...updateUser,
      [event.target.name]: event?.target.value,
    });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const key = 'updatable';
  const handleOk = (event: any) => {
    event?.preventDefault();
    editUser({
      variables :{
        firstName: firstName ,
        lastName: lastName,
        gender: gender,
        workplace: workplace,
        school: school,
        phoneNumber: phoneNumbers
      }
    })
    setDisabled(!disabled)

    setIsModalVisible(false);
    message.loading({ content: 'Loading...', key });
    setTimeout(() => {
      message.success({ content: 'Update infomation successfully', key, duration: 2 });
    }, 2000);
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
    <Menu style={{ marginTop: '20px' }}>
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
      <Modal title="Manage Account" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <div style={{ alignItems: 'center', flex: 1 }}>
          <Avatar className="avatarSetting" src={`${picture}`} style={{ height: 100, width: 100, marginLeft: 180 }} />
        </div>
        <Upload {...props}>
          <Button style={{ marginLeft: 160, marginTop: 20 }} icon={<UploadOutlined />}>
            Upload image
          </Button>
        </Upload>
        <div>
          First Name
          <Input placeholder="First Name..." onChange={onInputChange} value={firstName} name="firstName"  disabled={disabled}/>
        </div>
        <div style={{ marginTop: 10 }}>
          Last Name
          <Input placeholder="Last Name..." onChange={onInputChange} value={lastName} name="lastName" disabled={disabled}/>
        </div>
        <div style={{ marginTop: 10 }}>
          Email
          <Input placeholder="Email User..." value={`${email}`} disabled />
        </div>
        <div style={{ marginTop: 10, display: 'grid' }}>
          Gender
          <Input placeholder="Gender..." onChange={onInputChange} value={gender} name="gender" disabled={disabled}/>
        </div>
        <div style={{ marginTop: 10 }}>
          Work Place
          <Input placeholder="Work Place..." onChange={onInputChange} value={workplace} name="workplace"disabled={disabled} />
        </div>
        <div style={{ marginTop: 10 }}>
          School
          <Input placeholder="School..." onChange={onInputChange} value={school} name="school" disabled={disabled}/>
        </div>
        <div style={{ marginTop: 10 }}>
          Phone Number
          <Input placeholder="Phone Number..." onChange={onInputChange} value={phoneNumbers} name="phoneNumbers" disabled={disabled}/>
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
      <a className="ant-dropdown-link" style={{ color: 'black' }} onClick={(e) => e.preventDefault()}>
        <CaretDownOutlined />
      </a>
    </Dropdown>
  );
};
export default DropDown;
