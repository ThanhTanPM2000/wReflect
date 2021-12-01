import React, { useEffect, useState } from 'react';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Avatar, Col, Row } from 'antd';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/WorkSpace')
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
 

  return (
    <div>
      <Row  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
      {InfoCard.map((info: any, idx: number) => (
        <Col key={idx} className="gutter-row" span={6}>
          <div style={style} >
            <Card hoverable style={{ width: 300 }} cover={info.img}
            onClick={()=>console.log("TNT")
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" 
               />,
              <EllipsisOutlined key="ellipsis" />,
            ]}>
              <Meta avatar={info.avatar} title={info.name} description={info.desc} >
              </Meta>
            </Card>
          </div>
        </Col>
      ))}
      </Row>
    </div>
  );
};

export default CardWorkSpace;
