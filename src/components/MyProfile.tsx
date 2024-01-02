import React, { useState } from 'react';
import { Card, Button, Form, Input, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const MyProfile: React.FC = () => {
  const [editMode, setEditMode] = useState(false);

  // Sample user data, replace it with your actual user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePhoto: '', // URL of the profile photo
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const onFinish = (values: any) => {
    // Handle form submission, update user details in the backend, and disable edit mode
    // You can send the updated data to the server here
    console.log('Received values:', values);
    setEditMode(false);
    message.success('Profile updated successfully');
  };

  return (
    <div>
      <h1>My Profile</h1>
      <Card>
        <Form
          name="profileForm"
          onFinish={onFinish}
          initialValues={{ name: userData.name, email: userData.email }}
        >
          <Form.Item label="Name" name="name">
            {editMode ? (
              <Input prefix={<UserOutlined />} />
            ) : (
              <span>{userData.name}</span>
            )}
          </Form.Item>
          <Form.Item label="Email" name="email">
            {editMode ? (
              <Input />
            ) : (
              <span>{userData.email}</span>
            )}
          </Form.Item>
          <Form.Item label="Profile Photo">
            {editMode ? (
              <Upload maxCount={1} listType="picture">
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            ) : (
              <img
                src={userData.profilePhoto}
                alt="Profile"
                style={{ maxWidth: '100px', maxHeight: '100px' }}
              />
            )}
          </Form.Item>
          {editMode && (
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                  Save
                </Button>
                <Button onClick={toggleEditMode}>
                  Cancel
                </Button>
              </div>
            </Form.Item>
          )}
        </Form>
        {!editMode && (
          <Button type="primary" onClick={toggleEditMode}>
            Edit Profile
          </Button>
        )}
      </Card>
    </div>
  );
};

export default MyProfile;
