import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [likedTracks, setLikedTracks] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/mood');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      const [usersData, entriesData, tracksData] = await Promise.all([
        ApiService.getAllUsers(),
        ApiService.getAllDiaryEntries(),
        ApiService.getAllLikedTracks()
      ]);
      setUsers(usersData);
      setDiaryEntries(entriesData);
      setLikedTracks(tracksData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const getUserStats = (userId) => {
    const userEntries = diaryEntries.filter(entry => entry.userId === userId);
    const userLikes = likedTracks.filter(track => track.userId === userId);
    return {
      entriesCount: userEntries.length,
      likesCount: userLikes.length
    };
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEntries = diaryEntries.filter(entry => {
    const matchesSearch = !searchTerm || 
      Object.keys(entry.moods).some(mood => mood.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.music?.track && entry.music.track.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.note && entry.note.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDate = !dateFilter || 
      new Date(entry.date).toISOString().split('T')[0] === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  const filteredTracks = likedTracks.filter(trackObj => 
    trackObj.track.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortData = (data, field) => {
    if (!field) return data;
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      if (field === 'createdAt' || field === 'lastActive' || field === 'date') {
        aVal = new Date(aVal || 0);
        bVal = new Date(bVal || 0);
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedUsers = sortData(filteredUsers, sortField);
  const sortedEntries = sortData(filteredEntries, sortField);
  const sortedTracks = sortData(filteredTracks, sortField);

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>🔧 Админ-панель</h2>
      </div>

      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button 
          className={activeTab === 'users' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('users')}
          style={{ minWidth: '120px', width: 'auto' }}
        >
          👥 Пользователи
        </button>
        <button 
          className={activeTab === 'diary' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('diary')}
          style={{ minWidth: '120px', width: 'auto' }}
        >
          📝 Записи
        </button>
        <button 
          className={activeTab === 'liked' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('liked')}
          style={{ minWidth: '120px', width: 'auto' }}
        >
          ❤️ Лайки
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              flex: '1',
              minWidth: '200px'
            }}
          />
          {activeTab === 'diary' && (
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            />
          )}
          <button
            onClick={() => {
              setSearchTerm('');
              setDateFilter('');
            }}
            style={{
              padding: '10px 15px',
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Очистить
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="card">
          <h3>Пользователи ({sortedUsers.length} из {users.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                    Имя {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('email')}>
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                    Регистрация {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('lastActive')}>
                    Последняя активность {sortField === 'lastActive' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Записи</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Лайки</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map(user => {
                  const stats = getUserStats(user.id);
                  return (
                    <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{user.id}</td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>@{user.username}</div>
                      </td>
                      <td style={{ padding: '10px' }}>{user.email}</td>
                      <td style={{ padding: '10px' }}>
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString('ru-RU') : '-'}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{ 
                          background: stats.entriesCount > 0 ? '#0ABAB5' : '#ddd', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }}>
                          {stats.entriesCount}
                        </span>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{ 
                          background: stats.likesCount > 0 ? '#ff4757' : '#ddd', 
                          color: 'white', 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }}>
                          {stats.likesCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'diary' && (
        <div className="card">
          <h3>Записи дневника ({sortedEntries.length} из {diaryEntries.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('userId')}>
                    Пользователь {sortField === 'userId' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleSort('date')}>
                    Дата {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Настроения</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Музыка</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Заметка</th>
                </tr>
              </thead>
              <tbody>
                {sortedEntries.map(entry => {
                  const user = users.find(u => u.id === entry.userId);
                  return (
                    <tr key={entry.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{entry.id}</td>
                      <td style={{ padding: '10px' }}>
                        <div style={{ fontWeight: 'bold' }}>{user?.name || 'Неизвестно'}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>ID: {entry.userId}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {new Date(entry.date).toLocaleString('ru-RU')}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {Object.keys(entry.moods).join(', ')}
                      </td>
                      <td style={{ padding: '10px' }}>
                        {entry.music?.track || '-'}
                      </td>
                      <td style={{ padding: '10px', maxWidth: '200px' }}>
                        {entry.note || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'liked' && (
        <div className="card">
          <h3>Понравившиеся треки ({sortedTracks.length} из {likedTracks.length})</h3>
          <div style={{ marginTop: '20px' }}>
            {sortedTracks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Нет результатов</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {sortedTracks.map((trackObj) => {
                  const user = users.find(u => u.id === trackObj.userId);
                  return (
                    <li key={trackObj.id} style={{ 
                      padding: '15px', 
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <span style={{ fontSize: '20px' }}>❤️</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{trackObj.track}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          Пользователь: {user?.name || 'Неизвестно'} (ID: {trackObj.userId})
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '20px', backgroundColor: '#f8f8f8' }}>
        <h4>📊 Статистика</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ABAB5' }}>
              {users.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Всего пользователей</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0ABAB5' }}>
              {diaryEntries.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Всего записей</div>
          </div>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4757' }}>
              {likedTracks.length}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>Лайков</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;