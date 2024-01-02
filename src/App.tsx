import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Header from './components/Header';
import CustomLayout from './components/Layout';
import useBearStore from './state/state';


function App() {
  const isUserValid = useBearStore((state:any) => state.isUserValid);
  return (
    isUserValid ? (
      <div style={{ margin: '20px' }}> {/* Adjust the '20px' to whatever margin you prefer */}
      <Header />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 0.5 }}>
          <CustomLayout />
        </div>
        <div style={{ flex: 2,marginLeft:"20px",alignItems:"flex-start"}}>
          <Outlet />
        </div>
      </div>
    </div>
    
    ) : (
      <Navigate to={"/login"} />
    )
  );
}

export default App;
