import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import useUserStore from '../state/store';
import { format, isToday } from 'date-fns';
import Column from 'antd/es/table/Column';


interface Post {
  _id: string;
  creatorName: string;
  creatorEmail: string;
  title: string;
  creationDateTime: string;
  description: string;
  likes: string[];
  bookmarks: string[];
  comments: { _id: string, body: string; commenterEmail: string, commenterUsername: string, date: string }[];
}

interface TableData {
  title: string;
  creationDateTime: string;
  content: string;
  comments: { _id: string, body: string; commenterEmail: string, commenterUsername: string, date: string }[];
}

const MyPosts: React.FC = () => {
  const [posts, setPosts] = useState<TableData[]>([]);
  const { user } = useUserStore();

  useEffect(() => {


    fetchUserPosts();
  }, [user?.id]); // Rerun the effect if userId changes
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isToday(date) ? format(date, "hh:mm a") : format(date, "dd/MM/yyyy hh:mm a");
  };
  const fetchUserPosts = async () => {
    const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/by-user/${user?.id}`);
    if (response.ok) {
      const data = await response.json();
      console.log("data", data)
      // Remap data if necessary to fit the table format
      const formattedData = data.map((item: Post, index: number) => ({
        key: index + 1,
        title: item.title,
        description: item.description,
        comments: item.comments,
        date: formatDate(item.creationDateTime), // Adjust based on your actual date field
      }));
      console.log("posted", formattedData)
      setPosts(formattedData);
    } else {
      console.error("Failed to fetch posts:", response.status);
    }
  };
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>My Posts</h1>
      <Table dataSource={posts} rowKey="key" expandable={{
        expandedRowRender: record =>
          record.comments.length > 0 ? (
            <ul>
              {record.comments.map(comment => (
                <li key={comment._id}>
                  <strong>{comment.commenterUsername}: </strong>
                  {comment.body}
                </li>
              ))}
            </ul>
          ) : null,
      }}>
        <Column title="Post Number" dataIndex="key" key="key" />
        <Column title="Title" dataIndex="title" key="title" />
        <Column title="Description" dataIndex="description" key="description" />
        <Column title="Date" dataIndex="date" key="date" />

      </Table>
    </div>
  );
};

export default MyPosts;
