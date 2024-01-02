import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CustomLayout from '../src/components/Layout';
import Home from './components/Home';
import MyLikes from './components/MyLikes';
import MyBookmarks from './components/MyBookmarksPage';
import MyPosts from './components/MyPosts';
import MyProfile from './components/MyProfile';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import LogOut from './components/LogOut';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
   <Router>
      <Routes>
      <Route path='/' Component={App}>
          <Route path="home" Component={Home} />
          <Route path="my-likes" Component={MyLikes} />
          <Route path="my-bookmarks" Component={MyBookmarks} />
          <Route path="my-posts" Component={MyPosts} />
          <Route path="my-profile" Component={MyProfile} />
        </Route>
        <Route path="signup" Component={SignUp} />
        <Route path="login" Component={LogIn} />
        <Route path="logout" Component={LogOut} />
        <Route path='*' element={<Navigate to={"login"} />} />
         
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
