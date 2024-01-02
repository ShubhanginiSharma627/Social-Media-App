import React from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import useBearStore from '../state/state';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../state/store';

const LogIn: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  
  const onFinish = async(values: any) => {
    console.log('Received values:', values);
    const { email, password } = values;
    try {
        const response = await fetch('http://localhost:3000/api/users/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log('Logged in successfully:', result);
        setUser(result.user);
        setIsUserValid(true)
        navigate('/home');
        // Handle success - save token, redirect, etc.
      } catch (error) {
        console.log('Failed to login:', error);
      }
    // Navigate to home after login
  };

  const setIsUserValid = useBearStore((state:any) => state.setIsUserValid);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card title="Login" style={{ width: 300 }}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your username!' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
              <Button style={{ border: 'none',color:"coral" }} onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LogIn;
