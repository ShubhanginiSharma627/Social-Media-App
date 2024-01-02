import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import useBearStore from '../state/state';
import useUserStore from '../state/store';


const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const setIsUserValid = useBearStore((state:any) => state.setIsUserValid);
  const { setUser } = useUserStore();
  const onFinish = async(values: any) => {
    console.log('Received values:', values);
    const { fullname, email, password } = values; // Extract the values from the form

    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: fullname, email, password }), // Ensure these match your backend's expected parameters
      });

      if (!response.ok) {
        if (response.status === 409) { // User already exists
            console.log("form fields are set")
            form.setFields([
              {
                name: 'email',
                errors: ['Email already registered.'],
              },
            ]);
            return;
          }
        throw new Error(`Error! status: ${response.status}`);

      }

      const result = await response.json();
      console.log('Success:', result);
      setUser({
          username: fullname, email,
          image: ''
      });
      setIsUserValid(true); // Assuming registration automatically logs the user in
      navigate('/home'); // Navigate to home page or wherever appropriate
    } catch (error) {
      console.log('Failed to register:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card title="Sign Up" style={{ width: 300 }}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Full Name"
            name="fullname"
            rules={[{ required: true, message: 'Please input your full name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type="primary" htmlType="submit" style={{ flexGrow: 1, marginRight: '10px' }}>
                Sign Up
              </Button>
              <Button style={{ flexGrow: 1, border: 'none', boxShadow: 'none' }} onClick={() => navigate('/login')}>
                Login
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
