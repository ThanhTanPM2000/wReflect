import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import auth0, { AuthOptions } from 'auth0-js';
import { Row, Col, Form, Button, Input} from 'antd';

import { Header } from '../../components/Header';
import config from '../../config';
import {checkEmailPattern , checkPasswordPattern } from '../../utils/helpers'

import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoginOutlined,
  MailOutlined,
  LockOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

type Props = {
  email: string | null;
  picture: string | null;
};

const params = {
  domain: config.AUTH0_WEBAUTH_CONFIG.domain,
  clientID: config.AUTH0_WEBAUTH_CONFIG.clientID,
  redirectUri: config.AUTH0_WEBAUTH_CONFIG.redirectUri,
  responseType: config.AUTH0_WEBAUTH_CONFIG.responseType,
};

const databaseConnection = 'wReflectdb';
const webAuth = new auth0.WebAuth(params);

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



const LoginPage = ({ email, picture }: Props) => {

  const [login, setLogin] = useState({
    emailLogin: '',
    password: '',
  });
  const { emailLogin, password } = login;

  const [form] = Form.useForm();

  const onChangeInput = (event: any) => {
    setLogin({
      ...login,
      [event.target.name]: event?.target.value,
    });
  };

  const handleLogin = (event: any) => {
    event.preventDefault();
   
    form.validateFields().then(async (values: any) => {
      const emailLogin = values['emailLogin'];
      const password = values['password'];

      webAuth.login(
        {
          realm: databaseConnection,
          username: emailLogin,
          password: password,
        },
        () => {
          form.resetFields()
        },
      );
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
                height: '100%',
                alignItems: 'center',
                position: 'relative',
                backgroundColor: 'white',
                marginTop: 50,
                left: '10%',
                boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
                borderRadius: '10px',
              }}
            >
              <Col span={24} style={{ marginBottom: 100 }}>
                <Form form={form} autoComplete="off">
                  <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: 50 }}>Sign In</h1>
                  </div>
                  <div className="flex flex-1" style={{ marginLeft: 50 }}>
                    <Form.Item
                      name="emailLogin"
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
                        name="emailLogin"
                        onChange={onChangeInput}
                        value={emailLogin}
                        placeholder="Vui lòng nhập Email"
                        style={{ width: 450 }}
                      />
                    </Form.Item>
                    <Form.Item
                    name='password'
                    rules={[
                      {required: true, message: 'Vui lòng nhập mật khẩu !'},
                      {pattern: checkPasswordPattern, message: 'Mật khẩu phải dài hơn 8 kí tự , có ít nhât 1 chữ in hoa, 1 chữ số và 1 kí tự đặc biệt !'}
                    ]}
                    >
                      <Input.Password
                        style={{ width: 450 }}
                        size="large"
                        name="password"
                        onChange={onChangeInput}
                        value={password}
                        prefix={
                          <LockOutlined
                            style={{ color: 'gray', fontSize: 20, margin: '5px 5px 0px 0px', fontWeight: 'bold' }}
                          />
                        }
                        placeholder="Vui lòng nhập mật khẩu"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      />
                    </Form.Item>
                  </div>
                  <Row
                    gutter={16}
                    className="btn-login"
                    style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
                  >
                    <Col span={8}>
                      <Form.Item>
                        <Button
                          type="primary"
                          icon={<LoginOutlined />}
                          size="large"
                          onClick={handleLogin}
                          style={{ width: 150 }}
                          htmlType="submit"
                        >
                          Login
                        </Button>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Button type="default" icon={<UserAddOutlined />} size="large" style={{ width: 150 }}>
                        <Link to="/signuppage" style={{ color: 'black', marginLeft: 5 }}>
                          Sign Up
                        </Link>
                      </Button>
                    </Col>
                  </Row>
                </Form>
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
                      <Link to="/forgotpassword">Bạn không nhớ mật khẩu ?</Link>
                    </a>
                  </span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LoginPage;
