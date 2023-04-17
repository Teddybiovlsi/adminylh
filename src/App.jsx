import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './managed/Header';
import Footer from './managed/Footer';
import UserLoginForm from './client/UserLogin';
import BackendRegistration from './managed/Form/BackendRegistration';
import Home from './managed/Pages/Home';
import Pratice from './managed/Pages/Pratice';
import Exam from './managed/Pages/Exam';
import VideoPlayer from './managed/Pages/VideoPlayer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.css';

function App() {
  return (
    // Routes 若有網址則如第一範例/Register前面須加上/#組合起來為/#/Register
    //  <Route exact path="/" element={<UserLoginForm />} />
    <div className='container'>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Admin/Register' element={<BackendRegistration />} />
          <Route path='/Pratice' element={<Pratice />} />
          <Route path='/Exam' element={<Exam />} />
          <Route path='/Video' element={<VideoPlayer />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
