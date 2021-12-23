import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Carousel, Button, Row, Col, Card } from 'antd';
import { Header } from './../../components/Header';

type Props = {
  email: string | null;
  picture: string | null;
};

const contents = [
  {
    title: 'Start For Work',
    content:
      'The versatile retrospective tool for agile teams, collaborate with your team and get better in what you do with a simple, powerful and beautiful tool.',
  },
  {
    title: 'Experience Version Update Retro',
    content:
      'The upgraded version makes every interaction more complete in the application. It makes it easier for managers to control their members.',
  },
  {
    title: 'Do you want use it now ? ',
    content:
      "You can sign in by ways such as Google, Microsoft or your account and we also support you to sign in with your VLU account. If you haven't registered yet, please click the register button below.",
    register: (
      <Button type="primary">
        <Link to="/signuppage">Sign Up</Link>
      </Button>
    ),
  },
];

const HomePage = ({ email, picture }: Props) => {
  return (
    <div className="flex flex-1">
      <Header email={email} picture={picture} />
      <div className="flex flex-1 homepage">
        <Row gutter={24} className="nav-bar" style={{ padding: 100 }}>
          <Col className="carousel" span={12} style={{ paddingLeft: '15%', marginTop: 100 }}>
            <Carousel autoplay>
              {contents.map((content, idx) => {
                return (
                  <div key={idx}>
                    <h1 style={{ fontSize: 30 }}>{content.title}</h1>
                    <p>{content.content}</p>
                    <p>{content.register}</p>
                  </div>
                );
              })}
            </Carousel>
          </Col>
          <Col span={12}>
            <img src="/images/retro.gif" alt="" style={{ height: '100%', objectFit: 'cover' }} />
          </Col>
        </Row>
        <Row style={{ marginTop: 30 }}>
          <Col span={24}>
            <h1
              style={{
                fontSize: 40,
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                textShadow: '1px 5px grey',
              }}
            >
              FEELINGS AND EXCITEMENT OF RETRO USERS IN A NUTSHELL
            </h1>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
