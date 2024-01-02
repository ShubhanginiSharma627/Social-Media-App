import React from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  BookOutlined,
  ProfileOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';

const { Sider } = Layout;

const CustomLayout = () => {
  return (
   
      <Sider width={300}  theme="light">
        <Menu mode="vertical" theme="light">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/home">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<HeartOutlined />}>
            <Link to="/my-likes">My Likes</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<BookOutlined />}>
            <Link to="/my-bookmarks">My Bookmarks</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<ProfileOutlined />}>
            <Link to="/my-posts">My Posts</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<UserOutlined />}>
            <Link to="/my-profile">My Profile</Link>
          </Menu.Item>
        </Menu>
      </Sider>

  );
};

export default CustomLayout;
