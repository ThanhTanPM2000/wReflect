import React, { useEffect, useState } from 'react';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Avatar, Col, Row, Skeleton, Pagination, Empty } from 'antd';

const style = { margin: '0px 0px 0px 5px', padding: '8px 0' };
const { Meta } = Card;

export const InfoCard = [
  {
    name: 'Team 1',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 2',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 3',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 4',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 4',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 4',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 4',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
  {
    name: 'Team 4',
    img: <img alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" />,
    avatar: <Avatar src="https://joeschmoe.io/api/v1/random" />,
    desc: 'This is the description',
  },
];

const CardWorkSpace = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/WorkSpacse')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const listTeamCard = (loading: boolean) => {
    if (loading) {
      const arrayTeam = [];
      for (let idx = 1; idx <= 3; idx++) {
        arrayTeam.push(
          <Col key={idx} className="gutter-row" span={6}>
            <Card loading={true}></Card>
          </Col>,
        );
      }
      return arrayTeam;
    } else
      return InfoCard.map((info: any, idx: number) => (
        <Col key={idx} className="gutter-row" span={6}>
          <div style={style}>
            <Card
              hoverable
              onClick={() => console.log('TNT')}
              loading={loading}
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Skeleton loading={loading} avatar active>
                <Meta avatar={info.avatar} title={info.name} description={info.desc}></Meta>
              </Skeleton>
            </Card>
          </div>
        </Col>
      ));
  };

  return (
    <div className="flex flex-ai-c flex-jc-c">
      {/* {data.length == 0 ? ( */}
      {/* <Empty /> */}
      {/* ) : ( */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {[...listTeamCard(loading)]}
        <div className="flex flex-jc-c" style={{ width: '100%', marginTop: '14px' }}>
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </Row>
      {/* )} */}
    </div>
  );
};

export default CardWorkSpace;
