import React, { useState, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Row, Tabs, Avatar, Button, Input } from 'antd';

import { UserQueries } from '../../grapql-client/queries';
import { UserMutations } from '../../grapql-client/mutations';
import SelfContext from '../../contexts/selfContext';

type Props = {
  email: string | null;
  picture: string | null;
  name: string | null;
};
const { TextArea, Search } = Input;
const { TabPane } = Tabs;

const ProfileUser = ({ email, picture, name }: Props) => {
  const [disabled, setDisabled] = useState(true);
  const [desc, setDesc] = useState({
    introduction: '',
    talents: '',
    interests: '',
  });
  const me = useContext(SelfContext);
  const { introduction, talents, interests } = desc;
  const onInputChange = (event: any) => {
    setDesc({
      ...desc,
      [event.target.name]: event?.target.value,
    });
  };
  const [updateProfile] = useMutation(UserMutations.updateUser, {
    refetchQueries: [UserQueries.getUser],
  });
  const onSearch = (value: any) => console.log(value);
  const handleDisableInput = () => {
    setDisabled(!disabled);
  };

  const { loading, data } = useQuery(UserQueries.getUser, {
    variables: {
      userId: me?.id,
    },
  });
  const profile = data?.user?.profile;
  console.log(profile);

  const handleSave = () => {
    setDisabled(!disabled);

    updateProfile({
      variables: {
        introduction: introduction,
        talents: talents,
        interests: interests,
      },
    });
  };

  return (
    <Row>
      <Tabs style={{ flex: 1 }}>
        <TabPane style={{ textAlign: 'center', marginTop: 21 }} key="0">
          <div style={{ background: 'white', height: 800, marginRight: 20 }}>
            <div>
              <Avatar className="avatarSetting" src={`${picture}`} style={{ height: 150, width: 150, marginTop: 20 }} />
            </div>
            <div style={{ marginTop: 20, fontSize: 20 }}>
              {name === null ? <p>Please help me edit user name</p> : `${profile.firstName}${profile.lastName}`}
            </div>
            <div
              style={{ marginLeft: 10, display: 'inline-block', whiteSpace: 'nowrap', width: 490, overflow: 'hidden' }}
            >
              <div style={{ marginTop: 20, display: 'flex' }}>
                <h2>Email</h2>
                <p style={{ marginLeft: 100, fontSize: 20 }}>{`${email}`}</p>
              </div>
              {/* {loading && (
                <div>
                  <div style={{ display: 'flex' }}>
                    <h2>School</h2>
                    <p style={{ marginLeft: 87, fontSize: 20 }}>{profile.school}</p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <h2>Work Place</h2>
                    <p style={{ marginLeft: 46, fontSize: 20 }}>{profile?.workplace}</p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <h2>Introduction</h2>
                    <p style={{ marginLeft: 32, fontSize: 20 }}>{profile?.introduction}</p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <h2>Talents</h2>
                    <p style={{ marginLeft: 85, fontSize: 20 }}>{profile?.talents}</p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <h2>Interesting</h2>
                    <p style={{ marginLeft: 48, fontSize: 20 }}>{profile?.interests}</p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <h2>Phone</h2>
                    <p style={{ marginLeft: 90, fontSize: 20 }}>{profile?.phoneNumbers}</p>
                  </div>
                </div>
              )} */}
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
                onChange={onInputChange}
                value={introduction}
                name="introduction"
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
                onChange={onInputChange}
                value={talents}
                name="talents"
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
                onChange={onInputChange}
                value={interests}
                name="interests"
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
