import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import HomeScreen from './Screens/HomeScreen';
import LoginScreen from './Screens/LoginScreen';
import { auth } from './firebase';
import { login, logout, selectUser } from './features/counter/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProfileScreen from './Screens/ProfileScreen';


function App() {
  
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((userAuth) => {
      if(userAuth) {
        //logged In
        dispatch(login({
          uid: userAuth.uid,
          email: userAuth.email,
        }));
      }
      else {
        //Logged Out
        dispatch(logout());
      }
    });

  return unsubscribe;
}, [dispatch]);

  return (
    <div className="app">
       <BrowserRouter>
        {!user ? (
          <LoginScreen />
        ) : (
          <Routes>
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        )}
        
      </BrowserRouter>
    </div>
  );
}

export default App;
