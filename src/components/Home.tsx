// Home.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Input, List, Avatar, Space, Tooltip, Modal, Form } from 'antd';
import {
  PlusOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  BookOutlined,
  BookFilled,
} from '@ant-design/icons';

import { FormInstance } from 'antd/lib/form';
import useUserStore from '../state/store'; // Adjust the import path to your store file

const { TextArea } = Input;
const { Meta } = Card;

interface Post {
  id: string;
  creatorName: string;
  creatorEmail: string;
  title: string;
  creationDateTime: string;
  content: string;
  likes: string[];
  bookmarks: string[];
  comments: { body: string; commenterEmail: string }[];
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [createPostModalVisible, setCreatePostModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const createPostFormRef = useRef<FormInstance>(null);
  const { user } = useUserStore(); // Get the user from zustand store

  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    const response = await fetch('http://localhost:3000/api/posts');
    if (response.ok) {
      const data = await response.json();
      setPosts(data);
    } else {
      console.error(`Error fetching posts: ${response.status}`);
    }
  };
  const showCreatePostModal = () => setCreatePostModalVisible(true);
  const handleCancelCreatePost = () => {
    setCreatePostModalVisible(false);
    createPostFormRef.current?.resetFields();
  };

  const handleCreatePost = async (values: { title: string; content: string }) => {
    const response = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        creatorName: user?.username,
        creatorEmail: user?.email,
        title: values.title,
        content: values.content,
        date: new Date().toISOString(),
      }),
    });
    if (response.ok) {
      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      handleCancelCreatePost();
    } else {
      console.error(`Failed to create post: ${response.status}`);
    }
  };

  const toggleLike = async (postId: string) => {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail: user?.email }),
    });
    if (response.ok) {
      fetchPosts(); // Re-fetch posts to update likes
    } else {
      console.error(`Failed to toggle like: ${response.status}`);
    }
  };

  const toggleBookmark = async (postId: string) => {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userEmail: user?.email }),
    });
    if (response.ok) {
      fetchPosts(); // Re-fetch posts to update bookmarks
    } else {
      console.error(`Failed to toggle bookmark: ${response.status}`);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchPosts(); // Re-fetch posts after deletion
    } else {
      console.error(`Failed to delete post: ${response.status}`);
    }
  };

  const handleUpdatePost = async (postId: string, values: { title: string; content: string }) => {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: values.title,
        content: values.content,
      }),
    });
    if (response.ok) {
      fetchPosts(); // Re-fetch posts after updating
    } else {
      console.error(`Failed to update post: ${response.status}`);
    }
  };

  const openCommentModal = (post: Post) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setCommentModalVisible(false);
    setSelectedPost(null);
  };

  const handleAddComment = async (postId: string, commentText: string) => {
    const response = await fetch(`http://localhost:3000/api/posts/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: commentText,
        commenterEmail: user?.email,
      }),
    });
    if (response.ok) {
      fetchPosts(); // Re-fetch posts to update comments
    } else {
      console.error(`Failed to add comment: ${response.status}`);
    }
  };

  return (
    <div>
      <List
        itemLayout="vertical"
        dataSource={posts}
        renderItem={post => (
          <Card
            key={post.id}
            style={{ maxWidth: '80%', margin: '20px auto' }}
            actions={[
              <Tooltip title="Like">
                <Button
                  icon={post.likes.includes(user?.email || '') ? <LikeFilled /> : <LikeOutlined />}
                  onClick={() => toggleLike(post.id)}
                >{post.likes.length}</Button>
              </Tooltip>,
              <Tooltip title="Bookmark">
                <Button
                  icon={post.bookmarks.includes(user?.email || '') ? <BookFilled /> : <BookOutlined />}
                  onClick={() => toggleBookmark(post.id)}
                >{post.bookmarks.length}</Button>
              </Tooltip>,
              <Tooltip title="Add Comment">
                <Button icon={<CommentOutlined />} onClick={() => openCommentModal(post)}>{post.comments.length}</Button>
              </Tooltip>,
              user?.email === post.creatorEmail && (
                <Space>
                  <Tooltip title="Edit">
                    <Button icon={<EditOutlined />} onClick={() => handleUpdatePost(post.id, {title: post.title, content: post.content})}></Button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button icon={<DeleteOutlined />} onClick={() => handleDeletePost(post.id)}></Button>
                  </Tooltip>
                </Space>
              ),
            ]}
          >
            <Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={`${post.creatorName} - ${post.title}`}
              description={`Posted on ${post.creationDateTime}`}
            />
            <p>{post.content}</p>
          </Card>
        )}
      />

      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined />}
        size="large"
        style={{ position: 'fixed', left: 20, bottom: 20, fontSize: '24px', height: '50px', width: '50px', borderRadius: '50%' }}
        onClick={showCreatePostModal}
      />

      <Modal
        title="Create New Post"
        visible={createPostModalVisible}
        onCancel={handleCancelCreatePost}
        footer={null}
      >
        <Form onFinish={handleCreatePost} ref={createPostFormRef}>
          <Form.Item name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="content" rules={[{ required: true, message: 'Please input the content!' }]}>
            <TextArea rows={4} placeholder="Content" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Create Post</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Comments"
        visible={commentModalVisible}
        onCancel={closeCommentModal}
        footer={null}
      >
        <List
          dataSource={selectedPost?.comments}
          header={`${selectedPost?.comments.length} comments`}
          itemLayout="horizontal"
          renderItem={comment => (
            <p>{comment.body}</p>
          )}
        />
        <Form onFinish={(values) => {
            if (selectedPost) {
              handleAddComment(selectedPost.id, values.comment);
              closeCommentModal();
            }
          }}
        >
          <Form.Item name="comment" rules={[{ required: true, message: 'Please input your comment!' }]}>
            <TextArea rows={4} placeholder="Write your comment here" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add Comment</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
