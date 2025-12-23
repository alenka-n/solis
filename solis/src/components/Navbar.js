import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  
  // Не показываем навигацию на странице авторизации
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link 
          to="/mood" 
          className={`nav-item ${location.pathname === '/mood' ? 'active' : ''}`}
        >
          <div className="nav-icon">😊</div>
          <div>Настроение</div>
        </Link>
        
        <Link 
          to="/music" 
          className={`nav-item ${location.pathname === '/music' ? 'active' : ''}`}
        >
          <div className="nav-icon">🎵</div>
          <div>Музыка</div>
        </Link>
        
        <Link 
          to="/diary" 
          className={`nav-item ${location.pathname === '/diary' ? 'active' : ''}`}
        >
          <div className="nav-icon">📖</div>
          <div>Дневник</div>
        </Link>
        
        <Link 
          to="/profile" 
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <div className="nav-icon">👤</div>
          <div>Профиль</div>
        </Link>
        
        {userRole === 'admin' && (
          <Link 
            to="/admin" 
            className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            <div className="nav-icon">🔧</div>
            <div>Админ</div>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;