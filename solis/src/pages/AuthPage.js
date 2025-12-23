import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('Заполните все поля');
      return;
    }
    
    // Проверка админа
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
      return;
    }
    
    localStorage.setItem('userRole', 'user');
    navigate('/mood');
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Solis</h1>
        <p className="subtitle">Ваш музыкальный дневник настроений</p>
      </div>
      
      <div className="card">
        <form onSubmit={handleAuth}>
          <div className="form-group">
            <input
              type="text"
              className="input"
              placeholder="Имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="input"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <button 
          className="link-btn" 
          onClick={() => setIsLogin(!isLogin)}
          style={{ marginTop: '15px', width: '100%' }}
        >
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Есть аккаунт? Войдите'}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;