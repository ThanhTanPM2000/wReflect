import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import auth0 from 'auth0-js';
import { useHistory } from 'react-router-dom';
import { Row, Col, Form, Button, Input, message } from 'antd';

import { Header } from '../../components/Header';
import config from '../../config';
import { checkEmailPattern } from '../../utils/helpers';

import { MailOutlined } from '@ant-design/icons';

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

const ForgotPassword = ({ email, picture }: Props) => {
  const [emailForgot, setEmailForgot] = useState({
    emailSend: '',
  });
  const { emailSend } = emailForgot;
  const onInputChange = (event: any) => {
    setEmailForgot({
      ...emailForgot,
      [event.target.name]: event?.target.value,
    });
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const handleContinue = (event: any) => {
    event.preventDefault();
    setLoading(true);
    form.validateFields().then(async (values: any) => {
      const emailSend = values['emailSend'];
      webAuth.changePassword(
        {
          connection: databaseConnection,
          email: emailSend,
        },
        () => {
          message.success({
            content: 'Link khôi phục mật khẩu đã được gửi . Vui lòng kiểm tra Email !',
            key,
            duration: 2,
          });
          setLoading(false);
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
                height: 300,
                alignItems: 'center',
                position: 'relative',
                backgroundColor: 'white',
                top: '25%',
                left: '10%',
                boxShadow: '0 0px 8px 0 rgba(0, 0, 0, 0.2), 0 0px 20px 0 rgba(0, 0, 0, 0.19)',
                borderRadius: '10px',
              }}
            >
              <Col span={24} style={{ marginBottom: 60 }}>
                <Form form={form} autoComplete="off">
                  <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: 25, marginTop: 10 }}>Quên Mật Khẩu ?</h1>
                    <p>Nhập email bên dưới khôi phục mật khẩu mới</p>
                  </div>
                  <div className="flex flex-1" style={{ marginLeft: 50 }}>
                    <Form.Item
                      name="emailSend"
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
                        name="emailSend"
                        onChange={onInputChange}
                        value={emailSend}
                        style={{ width: 450 }}
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
                        style={{ width: 150 }}
                      >
                        Continue
                      </Button>
                      <h4
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          borderBottom: '1px solid gray',
                          lineHeight: '0.1em',
                          margin: '30px 0 30px',
                        }}
                      >
                        <span style={{ backgroundColor: '#fff', padding: '0 10px', color: 'gray' }}>
                          <Link to="/loginpage">Trở về trang Đăng Nhập</Link>
                        </span>
                      </h4>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ForgotPassword;
