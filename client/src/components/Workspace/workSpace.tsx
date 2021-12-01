import React,{useState} from "react"; 
import 'antd/dist/antd.css';
import {  Breadcrumb, Row, Col, Button, Tabs, Modal, Input, Cascader } from 'antd';
import {PlusCircleOutlined} from '@ant-design/icons';
import CardWorkSpace from './components/cardWorkSpace';

const { TextArea } = Input;
const { TabPane } = Tabs;

const Workspace = ()=>{
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
    const options = [
      {
        value: 'owners',
        label: 'Private - Only team owners can add members',
      },
      {
        value: 'Everybody',
        label: 'Public - Everyone in the team can add members',
      },
    ];

    return(
        <Breadcrumb>
              <Tabs className="tab" defaultActiveKey="1">
                <TabPane tab="WorkSpace" key="1">
                  <div className="site-layout-background card-workspace" style={{ padding: 24, minHeight: 600 }}>
                    <Tabs className="tab-inner" defaultActiveKey="1">
                      <TabPane tab="All" key="1" > 
                        <CardWorkSpace />
                      </TabPane>
                      <TabPane tab="Doing" key="2"></TabPane>
                      <TabPane tab="Done" key="3"></TabPane>
                    </Tabs>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col span={24}>
                        <div className="btn-new-team">
                          <Button icon={<PlusCircleOutlined />} size="large" onClick={showModal}>
                            New Team
                          </Button>
                          <Modal title="Create Your Team" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            Team Name
                            <Input placeholder="Nhập Tên Nhóm" />
                            Description
                            <TextArea placeholder="Mô tả nhóm" rows={4} />
                            Privacy
                            <Cascader style={{ width: '100%' }} options={options} placeholder="Select Privacy" />
                          </Modal>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </TabPane>
                <TabPane tab="My Portfolio" key="2">
                  <div>TNT</div>
                </TabPane>
              </Tabs>
            </Breadcrumb>
    )
}
export default Workspace;