import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import useUserStore from '../state/store';

const columns = [
    {
      title: 'Post Number',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Title',
      dataIndex: 'title', // Assuming 'title' is the field name in your data
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description', // Assuming 'description' is the field name in your data
      key: 'description',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    // Add more columns as needed
  ];
  interface Post {
    _id: string;
    creatorName: string;
    creatorEmail: string;
    title: string;
    creationDateTime: string;
    description: string;
    likes: string[];
    bookmarks: string[];
    comments: { body: string; commenterEmail: string,commenterUsername:string,date:string }[];
  }

  interface TableData {
    title: string;
    creationDateTime: string;
    content: string;
  }

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<TableData[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    

    fetchUserPosts();
  }, [user?.id]); // Rerun the effect if userId changes

  const fetchUserPosts = async () => {
    const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/by-user/${user?.id}`);
    if (response.ok) {
      const data = await response.json();
      console.log("data",data)
      // Remap data if necessary to fit the table format
      const formattedData = data.map((item: Post, index: number) => ({
        key: index + 1,
        title: item.title,
        description: item.description,
        date: item.creationDateTime, // Adjust based on your actual date field
      }));
      console.log("posted",formattedData)
      setPosts(formattedData);
    } else {
      console.error("Failed to fetch posts:", response.status);
    }
  };
  return (
    <div>
      <h1 style={{marginTop:0}}>My Posts</h1>
      <Table columns={columns} dataSource={posts} />
    </div>
  );
};

export default MyPosts;
