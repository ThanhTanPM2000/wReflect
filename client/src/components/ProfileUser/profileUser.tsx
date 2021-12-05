import React, { useState } from 'react';
import { Row, Tabs, Avatar, Button } from 'antd';
type Props = {
  email: string | null;
  picture: string | null;
};
const { TabPane } = Tabs;

const ProfileUser = ({ email, picture }: Props) => {
  return (
    <Row>
      <Tabs style={{ flex: 1 }}>
        <TabPane style={{ textAlign: 'center', marginTop: 21 }} key="0">
          <div style={{ background: 'white', height: 800, marginRight: 50 }}>
            <div>
              <Avatar className="avatarSetting" src={`${picture}`} style={{ height: 150, width: 150, marginTop: 20 }} />
            </div>
            <div style={{ marginTop: 20, fontSize: 20 }}>{`${email}`}</div>
            <div style={{ marginTop: 400 }}>
              <Button type="primary" style={{ width: 400, height: 50, borderRadius: 10 }}>
                Edit details
              </Button>
            </div>
            <div>
              <Button type="primary" style={{ marginTop: 20, width: 400, height: 50, borderRadius: 10 }}>
                Add talents and interests.
              </Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <Tabs style={{ flex: 2 }}>
        <TabPane tab="Introduction" key="1">
          <div style={{ background: 'white', height: 800 }}>TNT</div>
        </TabPane>
        <TabPane tab="My Portfolio" key="2">
          Portfolio
        </TabPane>
        <TabPane tab="Team" key="3">
          Team
        </TabPane>
      </Tabs>
    </Row>
  );
};

export default ProfileUser;
