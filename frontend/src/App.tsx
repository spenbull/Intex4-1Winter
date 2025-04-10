import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AdminMoviesPage from './pages/AdminMoviesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer'; // Import Footer component
import SignUpPage from './pages/SignUpPage';
import UserRecommendations from './pages/RecommenderPage';
import TvList from './pages/TvShowPage';
import { AdminAuthorizeView } from './components/AuthorizeAdminView';
import AdminLayout from './pages/AdminLayout';
import { useState } from 'react';
import AdminUsersPage from './pages/AdminUsersPage';



function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  return (
    <Router>
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/admin/movies' element={<AdminAuthorizeView>
            <AdminLayout theme={theme} setTheme={setTheme}>
              <AdminMoviesPage />
              </AdminLayout>
              </AdminAuthorizeView>} />

          <Route path = '/admin/users' element = {<AdminAuthorizeView>
            <AdminLayout theme={theme} setTheme={setTheme}>
              <AdminUsersPage />
              </AdminLayout>
              </AdminAuthorizeView>} />
          <Route
            path='/privacypolicy'
            element={
              <div className='max-w-4xl px-4 py-12 text-left'>
                <PrivacyPolicyPage />
              </div>
            }
          />
          <Route path='/sign-up' element={<SignUpPage />} />
          <Route path='/HomePage' element={<UserRecommendations/>} />
          <Route path="/MoviePage" element={<HomePage/>}/>
          <Route path="/TVPage" element={<TvList/>}/>
        </Routes>
      </div>
      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
