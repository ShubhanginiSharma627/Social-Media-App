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
import { Comment, Post } from '../types/posts';

const { TextArea } = Input;
const { Meta } = Card;


const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [createPostModalVisible, setCreatePostModalVisible] = useState<boolean>(false);
    const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const createPostFormRef = useRef<FormInstance>(null);
    const { user } = useUserStore(); // Get the user from zustand store
    const commentFormRef = useRef<FormInstance>(null);
    const [editPostModalVisible, setEditPostModalVisible] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

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

    const handleDeleteComment = async (postId: string | undefined, commentId: string) => {
        // Assuming you have an endpoint to delete a specific comment by its id
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}/comments/${commentId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchPosts();
            
            // other cleanup or state updates
        } else {
            console.error(`Failed to delete comment: ${response.status}`);
        }
    };

    const handleEditComment = async (postId: string | undefined, commentId: string, updatedText: string) => {
        // Assuming you have an endpoint to update a specific comment by its id
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}/comments/${commentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: updatedText,
            }),
        });
        if (response.ok) {
            fetchPosts();
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === postId) {
                        // Map through the comments of this post and update the specific comment
                        const updatedComments = post.comments.map(comment => {
                            if (comment._id === commentId) {
                                return { ...comment, body: updatedText }; // Update the comment body
                            }
                            return comment; // Return all other comments unchanged
                        });
                        return { ...post, comments: updatedComments }; // Return the updated post
                    }
                    return post; // Return all other posts unchanged
                });
            });
            setEditingComment(null)
            // other cleanup or state updates
        } else {
            console.error(`Failed to update comment: ${response.status}`);
        }
    };


    const handleUpdatePost = async (postId: string | undefined, values: { title: string | undefined; content: string | undefined }) => {
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
            closeEditModal()
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

    const closeEditModal = () => {
        setEditPostModalVisible(false);
        setEditingPost(null);
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
            const updatedComment = await response.json();
            console.log("prev Posta", posts)
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post._id === updatedComment._id) {
                        // Replace the post with updatedComment

                        return updatedComment;
                    }
                    console.log("posts comment updated", post)
                    return post; // Return all other posts unchanged
                });
            });

            console.log("updated Posta", posts)
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
                                <Button style={{ border: "none" }}
                                    icon={post.likes.includes(user?.email || '') ? <LikeFilled /> : <LikeOutlined />}
                                    onClick={() => toggleLike(post._id)}
                                >{post.likes.length}</Button>
                            </Tooltip>,
                            <Tooltip title="Bookmark">
                                <Button style={{ border: "none" }}
                                    icon={post.bookmarks.includes(user?.email || '') ? <BookFilled /> : <BookOutlined />}
                                    onClick={() => toggleBookmark(post._id)}
                                >{post.bookmarks.length}</Button>
                            </Tooltip>,
                            <Tooltip title="Add Comment">
                                <Button icon={<CommentOutlined />} style={{ border: "none" }} onClick={() => openCommentModal(post)}>{post.comments.length}</Button>
                            </Tooltip>,
                            user?.email === post.creatorEmail && (
                                <Space>
                                    <Tooltip title="Edit">
                                        <Button
                                            icon={<EditOutlined />}
                                            style={{ border: "none" }}
                                            onClick={() => {
                                                setEditingPost(post);
                                                setEditPostModalVisible(true);
                                            }}
                                        ></Button>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <Button icon={<DeleteOutlined />} style={{ border: "none" }} onClick={() => handleDeletePost(post._id)}></Button>
                                    </Tooltip>
                                </Space>
                            ),
                        ]}
                    >
                        {
                            user?.picture ? (
                                <div style={{ display: "flex", flexDirection: "row" }}>
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
                            ) : (
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
                        <List.Item>
                            {editingComment?._id === comment._id ? (
                                // If the comment is being edited, show an Input
                                <Form onFinish={(values) => handleEditComment(selectedPost?._id, comment._id, values.editedComment)}>
                                    <Form.Item
                                        name="editedComment"
                                        initialValue={comment.body}
                                    >
                                        <Input autoFocus />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Update</Button>
                                        <Button onClick={() => setEditingComment(null)}>Cancel</Button>
                                    </Form.Item>
                                </Form>
                            ) : (
                                // Otherwise, show the comment normally
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                    <Meta
                                        style={{ marginTop: "10px", width: "70%", display: "flex", flexDirection: "row" }}
                                        avatar={<Avatar icon={<UserOutlined />} style={{ marginRight: "10px" }} />}
                                        title={`${comment.commenterUsername}`}
                                        description={`${comment.body}`}
                                    />
                                    {
                                        comment.commenterEmail === user?.email && (
                                            <>
                                                <Tooltip title="Edit">
                                                    <Button icon={<EditOutlined />} style={{ border: "none" }} onClick={() => setEditingComment(comment)} />
                                                </Tooltip>
                                                <Tooltip title="Delete">
                                                    <Button icon={<DeleteOutlined />} style={{ border: "none" }} onClick={() => handleDeleteComment(selectedPost?._id, comment._id)} />
                                                </Tooltip>
                                            </>
                                        )
                                    }
                                </div>

                            )}
                        </List.Item>
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


            <Modal
                title="Edit Post"
                visible={editPostModalVisible}
                onCancel={() => setEditPostModalVisible(false)}
                footer={null}
            >
                <Form
                    initialValues={{
                        title: editingPost?.title,
                        content: editingPost?.description,
                    }}
                    onFinish={() => handleUpdatePost(editingPost?._id, { title: editingPost?.title, content: editingPost?.description })}
                >
                    <Form.Item name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
                        <Input placeholder="Title" />
                    </Form.Item>
                    <Form.Item name="content" rules={[{ required: true, message: 'Please input the content!' }]}>
                        <TextArea rows={4} placeholder="Content" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Update Post</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default Home;
