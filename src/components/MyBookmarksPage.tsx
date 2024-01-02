import React from 'react';
import { Card } from 'antd';

const MyBookmarks: React.FC = () => {
  // Assuming you have a list of bookmarked posts, replace it with your actual data
  const bookmarkedPosts = [
    { id: 1, content: 'Bookmarked post 1' },
    { id: 2, content: 'Bookmarked post 2' },
    // Add more bookmarked posts
  ];

  return (
    <div>
      <h1>My Bookmarks</h1>
      {bookmarkedPosts.map((post) => (
        <Card key={post.id}>
          <p>{post.content}</p>
          {/* Add other post details here */}
        </Card>
      ))}
    </div>
  );
};

export default MyBookmarks;
