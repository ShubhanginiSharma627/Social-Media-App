import React from 'react';
import { Button } from 'antd';

const LogOut: React.FC = () => {
  const handleLogout = () => {
    // Implement logout logic here
  };

  return (
    <div>
      <h1>Logout</h1>
      <Button type="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default LogOut;
