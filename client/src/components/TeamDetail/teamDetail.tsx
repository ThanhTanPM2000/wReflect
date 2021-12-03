import React, { useState } from 'react';
import { Menu, Row, Col, Button, Tabs, Modal, Input, Cascader, Affix, Pagination, Tag, Space, Table } from 'antd';
import './teamDetail.css';

import { DownOutlined, PlusCircleOutlined, UserAddOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Search, TextArea } = Input;
const { SubMenu } = Menu;

const onSearch = (value: any) => console.log(value);

const SourceOwner = [
  {
    key: '1',
    name: 'Thao',
    email: 'thaoduong1199@gmail.com',
    localtion: '',
    role: 'Owner',
  },
];
const SourceMember = [
  {
    key: '1',
    name: 'Thao',
    email: 'thaoduong1199@gmail.com',
    localtion: '',
    role: 'Owner',
  },
  {
    key: '2',
    name: 'Thao',
    email: 'thaoduong1199@gmail.com',
    localtion: '',
    role: 'Owner',
  },
  {
    key: '3',
    name: 'Thao',
    email: 'thaoduong1199@gmail.com',
    localtion: '',
    role: 'Owner',
  },
  {
    key: '4',
    name: 'Thao',
    email: 'thaoduong1199@gmail.com',
    localtion: '',
    role: 'Owner',
  },
];
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
];
const TeamDetail = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Tabs className="tab" defaultActiveKey="1" style={{ height: '100%' }}>
      <TabPane tab="Team Detail" key="1" style={{ height: '100%' }}>
        <div className="site-layout-background card-workspace" style={{ padding: 24, height: '100%' }}>
          <Tabs className="tab-inner" defaultActiveKey="1" style={{ height: '90%' }}>
            <TabPane tab="Member" key="1" className="flex flex-ai-c flex-jc-c">
              <Search
                className="search-member"
                placeholder="Nhập tên thành viên"
                allowClear
                onSearch={onSearch}
                style={{ width: 200 }}
              />
              <Menu defaultSelectedKeys={['1']} mode="inline">
                <SubMenu key="sub1" icon={<DownOutlined />} title="Owner">
                  <Table dataSource={SourceOwner} columns={columns} />;
                </SubMenu>
                <SubMenu key="sub2" icon={<DownOutlined />} title="Member">
                  <Table dataSource={SourceMember} columns={columns} />;
                </SubMenu>
              </Menu>
            </TabPane>
            <TabPane tab="Setting" key="2">
              <div>hello</div>
            </TabPane>
            <TabPane tab="Analytics" key="3">
              <div>Data</div>
            </TabPane>
          </Tabs>
          <div className="btn-new-team">
            <Button icon={<PlusCircleOutlined />} size="large" onClick={showModal}>
              New Member
            </Button>
            <Modal title="Thêm thành viên mới" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <Input placeholder="Vui lòng nhập tên hoặc email" />
            </Modal>
          </div>
        </div>
      </TabPane>
    </Tabs>
  );
};

export default TeamDetail;
