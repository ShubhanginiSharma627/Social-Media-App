import React from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  // Add more columns as needed
];

const MyPosts: React.FC = () => {
  // Assuming you have a list of user's posts, replace it with your actual data
  const userPosts = [
    { key: '1', content: 'User post 1', date: '2023-01-01' },
    { key: '2', content: 'User post 2', date: '2023-01-02' },
    // Add more user posts
  ];

  return (
    <div>
      <h1>My Posts</h1>
      <Table columns={columns} dataSource={userPosts} />
    </div>
  );
};

export default MyPosts;

