import React, { useState } from 'react';
import { Card, Button, Form, Input, Upload, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import useUserStore from '../state/store';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';


type FileListType = UploadFile<any>[];
const MyProfile: React.FC = () => {
    const [editMode, setEditMode] = useState(false);
    const { user, setUser } = useUserStore();
    const [fileList, setFileList] = useState<FileListType>([]);

    // Sample user data, replace it with your actual user data
    const userData = user;

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };
    const onFileChange = (info: { fileList: FileListType }) => {
        setFileList(info.fileList);
    };
    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append('username', values.name);
        formData.append('email', values.email);
        var pictureUrl:string = "";
        // Append the file if it exists
        if (fileList.length > 0 && fileList[0].originFileObj) {
            // You can convert the File object to a Blob and create a URL from it
            const pictureBlob = new Blob([fileList[0].originFileObj], { type: fileList[0].type });
             pictureUrl = URL.createObjectURL(pictureBlob);
           
        }
        
      
       if (user?.id){
        try {
            const response = await fetch(`http://localhost:3000/api/users/update/${user?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json', // Add this line
                },
                body: JSON.stringify({
                    username: values.name,
                    email: values.email,
                    picture: pictureUrl
                  }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                
                setUser({
                    id: updatedUser._id, username: updatedUser.username,
                    email: updatedUser.email,
                    picture: updatedUser.picture
                });
                message.success('Profile updated successfully');
                setEditMode(false);
            } else {
                message.error(`Failed to update profile: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            message.error('Failed to update profile.');
        }
       }
    };

    return (
        <div>
            <h1 style={{marginTop:0}}>My Profile</h1>
            <Card>
                <Form
                    name="profileForm"
                    onFinish={onFinish}
                    initialValues={{ name: userData?.username, email: userData?.email }}
                >
                    <Form.Item label="Name" name="name">
                        {editMode ? (
                            <Input prefix={<UserOutlined />} />
                        ) : (
                            <span>{userData?.username}</span>
                        )}
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        {editMode ? (
                            <Input />
                        ) : (
                            <span>{userData?.email}</span>
                        )}
                    </Form.Item>
                    <Form.Item label="Profile Photo" name="picture">
                        {editMode ? (
                            <Upload
                                maxCount={1}
                                listType="picture"
                                beforeUpload={() => false} // Return false to prevent auto uploading
                                onChange={onFileChange}
                                fileList={fileList} // Use the fileList state here
                            >
                                <Button icon={<UploadOutlined />}>Upload Photo</Button>
                            </Upload>
                        ) : (
                            <img
                                src={userData?.picture}
                                alt="Profile"
                                style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: "50%" }}
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
