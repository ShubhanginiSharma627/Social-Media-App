import React, { useState } from 'react';
import useBearStore from '../state/state';
import { Typography, Button, Alert } from 'antd';

const { Title } = Typography;

const Header = () => {
  const [showAlert, setShowAlert] = useState(false);
  const setIsUserValid = useBearStore((state:any) => state.setIsUserValid);

  const logout = () => {
    setShowAlert(false);
    setIsUserValid(false);
    // Implement actual logout logic here
  };

  return (
    <header style={{ padding: '2px 20px'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>STATS</Title>
        <Button type="primary" onClick={() => setShowAlert(true)}>
          Logout
        </Button>
      </div>
      {showAlert && (
        <Alert
          message="Are you sure you want to logout?"
          type="warning"
          closable
          onClose={() => setShowAlert(false)}
          action={
            <Button size="small" danger onClick={logout}>
              Confirm Logout
            </Button>
          }
          style={{ marginTop: '20px' }}
        />
      )}
    </header>
  );
};

export default Header;
