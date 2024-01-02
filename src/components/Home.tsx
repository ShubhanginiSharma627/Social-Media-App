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
import { format, isToday } from 'date-fns';

const { TextArea } = Input;
const { Meta } = Card;

interface Post {
    _id: string;
    creatorName: string;
    creatorEmail: string;
    title: string;
    creationDateTime: string;
    description: string;
    likes: string[];
    bookmarks: string[];
    comments: { body: string; commenterEmail: string, commenterUsername: string, date: string }[];
}

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [createPostModalVisible, setCreatePostModalVisible] = useState<boolean>(false);
    const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const createPostFormRef = useRef<FormInstance>(null);
    const { user } = useUserStore(); // Get the user from zustand store
    const commentFormRef = useRef<FormInstance>(null);

    useEffect(() => {
        fetchPosts();
    }, []);
    const fetchPosts = async () => {
        const response = await fetch('https://backend-8ut5.onrender.com/api/posts');
        if (response.ok) {
            const data = await response.json();
            console.log("data", data)
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
        const response = await fetch('https://backend-8ut5.onrender.com/api/posts', {
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
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isToday(date) ? format(date, "hh:mm a") : format(date, "dd/MM/yyyy hh:mm a");
    };

    const toggleLike = async (postId: string) => {
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}/like`, {
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
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}/bookmark`, {
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
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchPosts(); // Re-fetch posts after deletion
        } else {
            console.error(`Failed to delete post: ${response.status}`);
        }
    };

    const handleUpdatePost = async (postId: string, values: { title: string; content: string }) => {
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}`, {
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
        console.log("username", user?.username)
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user?.username,
                comment: commentText,
                email: user?.email,
            }),
        });
        if (response.ok) {
            fetchPosts();
            commentFormRef.current?.resetFields();
        } else {
            console.error(`Failed to add comment: ${response.status}`);
        }
    };
    console.log("posts", posts)
    return (
        <div>
            <h1 style={{ marginTop: 0 }}>Home</h1>
            <List
                itemLayout="vertical"
                dataSource={posts}
                renderItem={post => (
                    <Card
                        key={post._id}
                        style={{ maxWidth: '80%', margin: '20px auto' }}
                        actions={[
                            <Tooltip title="Like">
                                <Button style={{border:"none"}}
                                    icon={post.likes.includes(user?.email || '') ? <LikeFilled /> : <LikeOutlined />}
                                    onClick={() => toggleLike(post._id)}
                                >{post.likes.length}</Button>
                            </Tooltip>,
                            <Tooltip title="Bookmark">
                                <Button style={{border:"none"}}
                                    icon={post.bookmarks.includes(user?.email || '') ? <BookFilled /> : <BookOutlined />}
                                    onClick={() => toggleBookmark(post._id)}
                                >{post.bookmarks.length}</Button>
                            </Tooltip>,
                            <Tooltip title="Add Comment">
                                <Button icon={<CommentOutlined />} style={{border:"none"}} onClick={() => openCommentModal(post)}>{post.comments.length}</Button>
                            </Tooltip>,
                            user?.email === post.creatorEmail && (
                                <Space>
                                    <Tooltip title="Edit">
                                        <Button icon={<EditOutlined />} style={{border:"none"}} onClick={() => handleUpdatePost(post._id, { title: post.title, content: post.description })}></Button>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <Button icon={<DeleteOutlined />} style={{border:"none"}} onClick={() => handleDeletePost(post._id)}></Button>
                                    </Tooltip>
                                </Space>
                            ),
                        ]}
                    >
                        {
                            user?.picture ?(
                                <div style={{display:"flex",flexDirection:"row"}}>
                                    <img
                                        src={user?.picture}
                                        alt="Profile"
                                        style={{ maxWidth: '50px', maxHeight: '50px', borderRadius: "50%" }}
                                    />
                                   <div>
                                   <h4>{post.creatorName} - {post.title}</h4>
                                   <p>Posted on {formatDate(post.creationDateTime)}</p>
                                   </div>
                                </div>
                            ): (
                                <Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={`${post.creatorName} - ${post.title}`}
                                    description={`Posted on ${formatDate(post.creationDateTime)}`}
                                />
                            ) 
                        }
                        <p>{post.description}</p>
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
                    itemLayout="vertical"
                    renderItem={comment => (
                        <Meta

                            style={{ marginTop: "10px", width: "70%", display: "flex", flexDirection: "row" }}
                            avatar={<Avatar icon={<UserOutlined />} style={{ marginRight: "10px" }} />}
                            title={`${comment.commenterUsername}`}
                            description={`${comment.body}`}

                        />
                    )}
                />
                <Form
                    ref={commentFormRef}
                    onFinish={(values) => {
                        if (selectedPost) {
                            handleAddComment(selectedPost._id, values.comment);
                            closeCommentModal()
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
