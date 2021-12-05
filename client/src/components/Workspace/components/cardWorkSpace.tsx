import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, Avatar, Col, Row, Skeleton, Pagination, Empty, Modal } from 'antd';

import { useQuery } from '@apollo/client';
import { getTeams } from '../../../grapql-client/queries';

const style = { margin: '0px 0px 0px 5px', padding: '8px 0' };
const { Meta } = Card;

const CardWorkSpace = () => {
  const { error, data } = useQuery(getTeams);
  const getAllTeam = data?.teams?.data;
  console.log(getAllTeam);

  const [base, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const redirect = () => {
    history.push('/team-detail');
  };

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

  const hadleSetting = () => {
    return <Modal></Modal>;
  };

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
    } else {
      return getAllTeam.map((info: any, idx: number) => (
        <Col key={idx} className="gutter-row" span={6}>
          <div style={style}>
            <Card
              hoverable
              onClick={redirect}
              loading={loading}
              actions={[
                <SettingOutlined onClick={hadleSetting} key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Skeleton loading={loading} avatar active>
                <Meta avatar={info.picture} title={info.name} description={info.description}></Meta>
              </Skeleton>
            </Card>
          </div>
        </Col>
      ));
    }
  };

  return (
    <div className="flex flex-ai-c flex-jc-c">
      {/* {data.length == 0 ? ( */}
      {/* <Empty /> */}
      {/* ) : ( */}
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {/* {[...listTeamCard(loading)]} */}
        <div className="flex flex-jc-c" style={{ width: '100%', marginTop: '14px' }}>
          <Pagination defaultCurrent={1} total={50} />
        </div>
      </Row>
      {/* )} */}
    </div>
  );
};

export default CardWorkSpace;
