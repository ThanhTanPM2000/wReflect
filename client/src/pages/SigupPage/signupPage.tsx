import React, { useState } from 'react';
import { Row, Col, Form, Button, Input, Space, message } from 'antd';
import auth0, { AuthOptions } from 'auth0-js';
import { Link, useHistory } from 'react-router-dom';

import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Header } from '../../components/Header';
import config from '../../config';
import { checkEmailPattern, checkPasswordPattern, checkOnlyString } from '../../utils/helpers';

type Props = {
  email: string | null;
  picture: string | null;
};

const key = 'updatable';
const params = {
  domain: config.AUTH0_WEBAUTH_CONFIG.domain,
  clientID: config.AUTH0_WEBAUTH_CONFIG.clientID,
  redirectUri: config.AUTH0_WEBAUTH_CONFIG.redirectUri,
  responseType: config.AUTH0_WEBAUTH_CONFIG.responseType,
};

const databaseConnection = 'wReflectdb';

const webAuth = new auth0.WebAuth(params);

const SignUpPage = ({ email, picture }: Props) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [signup, setSignUp] = useState({
    username: '',
    emailSignup: '',
    password: '',
  });
  const { username, emailSignup, password } = signup;
  const [form] = Form.useForm();
  const onInputChange = (event: any) => {
    setSignUp({
      ...signup,
      [event.target.name]: event.target.value,
    });
  };
  const handleContinue = (event: any) => {
    setLoading(true);
    event.preventDefault();
    form.validateFields().then(async (values: any) => {
      const username = values['username'];
      const emailSignup = values['emailSignup'];
      const password = values['password'];
      webAuth.signup(
        {
          username: username,
          email: emailSignup,
          password: password,
          connection: databaseConnection,
        },
        (err) => {
          if (err) {
            console.log(err);
          } else {
            history.push('/loginpage');
            message.success({ content: 'Successful Registration !', key, duration: 2 });
          }
        },
      );
    });
  };

  const LoginWithGG = () => {
    webAuth.authorize({
      connection: 'google-oauth2',
    });
  };
  const LoginWithMicrosoft = () => {
    webAuth.authorize({
      connection: 'windowslive',
    });
  };

  const LoginWithVLU = () => {
    webAuth.authorize({
      connection: 'wReflect',
    });
  };

  return (
    <>
      <Header email={email} picture={picture} />
      <div className="flex flex-1" style={{ display: 'flex', backgroundColor: 'white' }}>
        <Row>
          <Col span={15} style={{ padding: 70 }}>
            <img src="/images/homePageMale.png" alt="" style={{ width: 500 }} />
            <img src="/images/homePageFemale.png" alt="" style={{ width: 500 }} />
          </Col>
          <Col span={6}>
            <Row
              style={{
                width: 560,
                height: 800,
                alignItems: 'center',
                position: 'relative',
                backgroundColor: 'white',
                marginTop: 50,
                left: '10%',
                boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
                borderRadius: '10px',
              }}
            >
              <Col span={24} style={{ marginBottom: 60 }}>
                <Form form={form} autoComplete="off">
                  <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: 50 }}>Sign Up</h1>
                  </div>
                  <div className="flex flex-1" style={{ marginLeft: 50 }}>
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên người dùng !' },
                        {max: 15, message: 'Tên người dùng quá dài !'},
                        { pattern: checkOnlyString, message: 'Tên người dùng không được có khoảng trắng !' },
                      ]}
                    >
                      <Input
                        size="large"
                        prefix={
                          <UserOutlined
                            style={{ color: 'gray', fontSize: 20, margin: '5px 5px 0px 0px', fontWeight: 'bold' }}
                          />
                        }
                        placeholder="Vui lòng nhập tên đăng nhập"
                        name="username"
                        onChange={onInputChange}
                        value={username}
                        style={{ width: 450 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="emailSignup"
                      rules={[
                        { required: true, message: 'Vui lòng nhập Email!' },
                        { pattern: checkEmailPattern, message: 'Email không hợp lệ' },
                      ]}
                    >
                      <Input
                        size="large"
                        prefix={
                          <MailOutlined
                            style={{ color: 'gray', fontSize: 20, margin: '5px 5px 0px 0px', fontWeight: 'bold' }}
                          />
                        }
                        placeholder="Vui lòng nhập Email"
                        name="emailSignup"
                        onChange={onInputChange}
                        value={emailSignup}
                        style={{ width: 450 }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu !' },
                        {
                          pattern: checkPasswordPattern,
                          message:
                            'Mật khẩu phải dài hơn 8 kí tự , có ít nhât 1 chữ in hoa, 1 chữ số và 1 kí tự đặc biệt !',
                        },
                      ]}
                    >
                      <Input.Password
                        style={{ width: 450 }}
                        size="large"
                        prefix={
                          <LockOutlined
                            style={{ color: 'gray', fontSize: 20, margin: '5px 5px 0px 0px', fontWeight: 'bold' }}
                          />
                        }
                        placeholder="Vui lòng nhập mật khẩu"
                        name="password"
                        onChange={onInputChange}
                        value={password}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>
                  </div>
                  <Row className="btn-login" style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    <Col span={24}>
                      <Button
                        type="default"
                        loading={loading}
                        onClick={handleContinue}
                        size="large"
                        style={{ width: 160, marginTop: 15 }}
                      >
                        Continue
                      </Button>
                    </Col>
                  </Row>
                  <h4
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      borderBottom: '1px solid gray',
                      lineHeight: '0.1em',
                      margin: '40px 0 40px',
                    }}
                  >
                    <span style={{ backgroundColor: '#fff', padding: '0 10px', color: 'gray' }}>
                      or Login with Social
                    </span>
                  </h4>
                  <div className="login-with-social">
                    <Row gutter={24}>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Button size="large" onClick={LoginWithGG}>
                          <img src="/images/iconGG.png" alt="" style={{ height: 40, width: 40, marginRight: 10 }} />
                          Google
                        </Button>
                      </Col>
                      <Col span={8} style={{ marginBottom: 10 }}>
                        <Button size="large" onClick={LoginWithMicrosoft}>
                          <img src="/images/iconMS.png" alt="" style={{ height: 40, width: 40, marginRight: 10 }} />
                          Microsoft
                        </Button>
                      </Col>
                      <Col span={8}>
                        <Button size="large" onClick={LoginWithVLU}>
                          <img
                            src="/images/iconVLU.png"
                            alt=""
                            style={{ height: 35, width: 35, marginRight: 10, objectFit: 'cover' }}
                          />
                          VLU
                        </Button>
                      </Col>
                    </Row>
                  </div>
                  <div
                    className="flex flex-2 forgot-password"
                    style={{ textAlign: 'center', position: 'relative', top: '60px' }}
                  >
                    <span>
                      <a href="">
                        {' '}
                        <Link to="/loginpage">Quay về trang đăng nhập</Link>
                      </a>
                    </span>
                  </div>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SignUpPage;
