import React from 'react';
import { Card } from 'antd';

const MyLikes: React.FC = () => {
  // Assuming you have a list of liked posts, replace it with your actual data
  const likedPosts = [
    { id: 1, content: 'Liked post 1' },
    { id: 2, content: 'Liked post 2' },
    // Add more liked posts
  ];

  return (
    <div>
      <h1>My Likes</h1>
      {likedPosts.map((post) => (
        <Card key={post.id}>
          <p>{post.content}</p>
          {/* Add other post details here */}
        </Card>
      ))}
    </div>
  );
};

export default MyLikes;
