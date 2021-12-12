import React, {useState} from 'react';
import { Row, Tabs, Avatar, Button, Input} from 'antd';


type Props = {
  email: string | null;
  picture: string | null;
  name: string | null;
};
const { TextArea, Search } = Input;
const { TabPane } = Tabs;

const ProfileUser = ({ email, picture, name }: Props) => {
  const [disabled , setDisabled ] = useState(true)
  const onSearch = (value: any) => console.log(value);
  const handleDisableInput = () => {
    setDisabled(!disabled)
  }
  const handleSave = () => {
    setDisabled(!disabled)
  }

  return (
    <Row>
      <Tabs style={{ flex: 1 }}>
        <TabPane style={{ textAlign: 'center', marginTop: 21 }} key="0">
          <div style={{ background: 'white', height: 800, marginRight: 20 }}>
            <div>
              <Avatar className="avatarSetting" src={`${picture}`} style={{ height: 150, width: 150, marginTop: 20 }} />
            </div>
            <div style={{ marginTop: 20, fontSize: 20 }}>
              {name === null ? <p>Please help me edit user name</p> : name}
            </div>
            <div
              style={{ marginLeft: 10, display: 'inline-block', whiteSpace: 'nowrap', width: 490, overflow: 'hidden' }}
            >
              <div style={{ marginTop: 20, display: 'flex' }}>
                <h2>Email</h2>
                <p style={{ marginLeft: 100, fontSize: 20 }}>{`${email}`}</p>
              </div>
              <div style={{ display: 'flex' }}>
                <h2>Introduction</h2>
                <p style={{ marginLeft: 32, fontSize: 20 }}>Tôi có thể làm mọi thứ bạn muốn</p>
              </div>
              <div style={{ display: 'flex' }}>
                <h2>Talents</h2>
                <p style={{ marginLeft: 85, fontSize: 20 }}>Front-end</p>
              </div>
              <div style={{ display: 'flex' }}>
                <h2>Interesting</h2>
                <p style={{ marginLeft: 48, fontSize: 20 }}>Read Book, Sing, Football</p>
              </div>
              <div style={{ display: 'flex' }}>
                <h2>Phone</h2>
                <p style={{ marginLeft: 90, fontSize: 20 }}>Read Book, Sing, Football</p>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
      <Tabs style={{ flex: 2 }}>
        <TabPane tab="Introduction" key="1">
          <div style={{ background: 'white', height: 800 }}>
            <div style={{ padding: 10 }}>
              <h1>
                <u>My Introduction</u>
              </h1>
              <TextArea
                style={{ marginTop: 10, marginLeft: 50, width: 1100, height: 150 }}
                placeholder="Nhập thông tin giới thiệu"
                rows={8}
                disabled={disabled}
              />
              <hr style={{ marginTop: 20, width: '70%' }} />

              <h1>
                <u>My Talents</u>
              </h1>
              <TextArea
                style={{ marginTop: 10, marginLeft: 50, width: 1100, height: 150 }}
                placeholder="Nhập tài năng của bạn"
                rows={8}
                disabled={disabled}
              />
              <hr style={{ marginTop: 20, width: '70%' }} />
              <h1>
                <u>My Interesting</u>
              </h1>
              <TextArea
                style={{ marginTop: 10, marginLeft: 50, width: 1100, height: 150 }}
                placeholder="Nhập sở thích của bạn"
                rows={8}
                disabled={disabled}
              />
              <Button
                type="primary"
                style={{
                  marginTop: 40,
                  marginRight: 30,
                  width: 100,
                  height: 40,
                  borderRadius: 10,
                  fontSize: 15,
                  float: 'right',
                }}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="default"
                style={{
                  marginTop: 40,
                  marginRight: 30,
                  width: 100,
                  height: 40,
                  borderRadius: 10,
                  fontSize: 15,
                  float: 'right',
                }}
                onClick={handleDisableInput}
              >
                Edit
              </Button>
            </div>
          </div>
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
