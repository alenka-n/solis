import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: localStorage.getItem('userName') || 'Пользователь',
    email: localStorage.getItem('userEmail') || 'user@solis.app',
    avatar: localStorage.getItem('userAvatar') || '👤'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await ApiService.getUserProfile();
      setProfile({
        name: userProfile.name || localStorage.getItem('userName') || 'Пользователь',
        email: userProfile.email || localStorage.getItem('userEmail') || 'user@solis.app',
        avatar: userProfile.avatar || localStorage.getItem('userAvatar') || '👤'
      });
    } catch (error) {
      console.log('API not available, using localStorage');
    }
  };

  const handleSave = async () => {
    try {
      await ApiService.updateUserProfile(profile);
      console.log('Профиль обновлен в базе данных');
    } catch (error) {
      console.log('API не доступен, сохраняем локально');
    }
    
    localStorage.setItem('userName', profile.name);
    localStorage.setItem('userEmail', profile.email);
    localStorage.setItem('userAvatar', profile.avatar);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const avatars = ['👤', '😊', '😎', '🤩', '😌', '🥰', '😄', '😁'];

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Профиль</h2>
      </div>
      
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {isEditing ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setProfile({...profile, avatar: event.target.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ marginBottom: '10px', width: '100%' }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
                  {avatars.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setProfile({...profile, avatar: emoji})}
                      style={{
                        width: '40px',
                        height: '40px',
                        border: profile.avatar === emoji ? '2px solid #0ABAB5' : '1px solid #ddd',
                        borderRadius: '50%',
                        background: 'white',
                        fontSize: '20px',
                        cursor: 'pointer'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Имя"
                style={{ marginBottom: '10px' }}
              />
              <input
                className="input"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                placeholder="Email"
              />
            </div>
          ) : (
            <div>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                background: profile.avatar.startsWith('data:') ? 'transparent' : '#0ABAB5', 
                borderRadius: '50%', 
                margin: '0 auto 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white',
                backgroundImage: profile.avatar.startsWith('data:') ? `url(${profile.avatar})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}>
                {!profile.avatar.startsWith('data:') && profile.avatar}
              </div>
              <h3>{profile.name}</h3>
              <p style={{ color: '#666' }}>{profile.email}</p>
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Статистика</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f8f8f8', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ABAB5' }}>
                {JSON.parse(localStorage.getItem('diaryEntries') || '[]').length + 2}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Записей</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px', background: '#f8f8f8', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0ABAB5' }}>7</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Дней подряд</div>
            </div>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '10px' }}>Любимые эмоции</h4>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>😊</span>
            <span style={{ fontSize: '1.5rem' }}>😌</span>
            <span style={{ fontSize: '1.5rem' }}>🥰</span>
          </div>
        </div>
      </div>
      
      {isEditing ? (
        <div>
          <button className="btn btn-primary" onClick={handleSave} style={{ marginBottom: '10px' }}>
            Сохранить
          </button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
            Отмена
          </button>
        </div>
      ) : (
        <div>
          <button className="btn btn-primary" onClick={() => setIsEditing(true)} style={{ marginBottom: '10px' }}>
            Редактировать профиль
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;