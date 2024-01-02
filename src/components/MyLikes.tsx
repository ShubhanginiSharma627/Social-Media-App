import React, { useEffect, useRef, useState } from 'react';
import { Card, Avatar, Button, List, Tooltip, Space, FormInstance, Form, Modal } from 'antd';
import useUserStore from '../state/store';
import Meta from 'antd/es/card/Meta';
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
import { format, isToday } from 'date-fns';
import TextArea from 'antd/es/input/TextArea';
// Replace this URL with your actual endpoint
const API_URL = 'https://backend-8ut5.onrender.com/api/users';
interface Post {
    _id: string;
    creatorName: string;
    creatorEmail: string;
    title: string;
    creationDateTime: string;
    content: string;
    likes: string[];
    bookmarks: string[];
    comments: { body: string; commenterEmail: string, commenterUsername: string, date: string }[];
}
const MyLikes = () => {
    const [likedPosts, setLikedPosts] = useState<Post[]>([]);
    const { user, setUser } = useUserStore();
    const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const commentFormRef = useRef<FormInstance>(null);
    useEffect(() => {

        fetchLikedPosts();
    }, [user?.id]);
    const fetchLikedPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/${user?.id}/liked-posts`);
            if (response.ok) {
                const posts = await response.json();
                setLikedPosts(posts);
            } else {
                console.error('Failed to fetch liked posts');
            }
        } catch (error) {
            console.error('Error fetching liked posts:', error);
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
            fetchLikedPosts(); // Re-fetch posts to update likes
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

            fetchLikedPosts(); // Re-fetch posts to update bookmarks
        } else {
            console.error(`Failed to toggle bookmark: ${response.status}`);
        }
    };

    const handleDeletePost = async (postId: string) => {
        const response = await fetch(`https://backend-8ut5.onrender.com/api/posts/${postId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchLikedPosts(); // Re-fetch posts after deletion
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
            fetchLikedPosts(); // Re-fetch posts after updating
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
            fetchLikedPosts();
            commentFormRef.current?.resetFields();
        } else {
            console.error(`Failed to add comment: ${response.status}`);
        }
    };

    return (
        <div>
            <h1 style={{ marginTop: 0 }}>My Likes</h1>
            <List
                itemLayout="vertical"
                dataSource={likedPosts}
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
                                        <Button icon={<EditOutlined />} style={{border:"none"}} onClick={() => handleUpdatePost(post._id, { title: post.title, content: post.content })}></Button>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <Button icon={<DeleteOutlined />} style={{border:"none"}}  onClick={() => handleDeletePost(post._id)}></Button>
                                    </Tooltip>
                                </Space>
                            ),
                        ]}
                    >
                        {
                            user?.picture ? (
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
                            ) : (
                                <Meta
                                    avatar={<Avatar icon={<UserOutlined />} />}
                                    title={`${post.creatorName} - ${post.title}`}
                                    description={`Posted on ${formatDate(post.creationDateTime)}`}
                                />
                            )
                        }
                        <p>{post.content}</p>
                    </Card>
                )}
            />
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

export default MyLikes;