import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import ApiService from '../services/api';

function DiaryPage() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [editingEntry, setEditingEntry] = useState(null);
  const [editNote, setEditNote] = useState('');
  const { playTrack, currentTrack, isPlaying, toggleLike, isLiked } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    loadEntries();
  }, []);

  const deleteEntry = (entryId) => {
    if (window.confirm('Удалить эту запись?')) {
      const updatedEntries = entries.filter(entry => entry.id !== entryId);
      setEntries(updatedEntries);
      localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    }
  };

  const startEdit = (entry) => {
    setEditingEntry(entry.id);
    setEditNote(entry.note || '');
  };

  const saveEdit = (entryId) => {
    const updatedEntries = entries.map(entry => 
      entry.id === entryId ? { ...entry, note: editNote } : entry
    );
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
    setEditingEntry(null);
    setEditNote('');
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditNote('');
  };
  const loadEntries = async () => {
    try {
      const apiEntries = await ApiService.getDiaryEntries();
      setEntries(apiEntries);
    } catch (error) {
      const savedEntries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
      
      // Добавляем демо-записи только если нет сохраненных
      if (savedEntries.length === 0) {
        const demoEntries = [
          {
            id: 1,
            date: new Date(Date.now() - 86400000).toISOString(),
            moods: { happy: { intensity: 80 }, calm: { intensity: 60 } },
            music: { track: 'Солнечная мелодия', playlist: 'Хорошее настроение' },
            note: 'Отличный день на работе!'
          },
          {
            id: 2,
            date: new Date(Date.now() - 172800000).toISOString(),
            moods: { sad: { intensity: 70 } },
            music: { track: 'Грустная баллада', playlist: 'Меланхолия' },
            note: 'Немного грустно из-за дождя'
          }
        ];
        setEntries(demoEntries);
        localStorage.setItem('diaryEntries', JSON.stringify(demoEntries));
      } else {
        setEntries(savedEntries);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const getMoodEmojis = (moods) => {
    const moodMap = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      calm: '😌',
      excited: '🤩',
      anxious: '😰',
      love: '🥰',
      tired: '😴'
    };

    return Object.keys(moods).map(moodId => moodMap[moodId]).join(' ');
  };

  const getEntriesForDate = (date) => {
    const dateStr = date.toDateString();
    return entries.filter(entry => new Date(entry.date).toDateString() === dateStr);
  };

  const getMoodColor = (moods) => {
    const moodColors = {
      happy: '#FFD93D',
      sad: '#6C7CE0', 
      angry: '#FF6B6B',
      calm: '#4ECDC4',
      excited: '#FF8A65',
      anxious: '#9C88FF',
      love: '#FF69B4',
      tired: '#95A5A6'
    };
    
    const moodKeys = Object.keys(moods);
    if (moodKeys.length === 0) return '#0ABAB5';
    
    return moodColors[moodKeys[0]] || '#0ABAB5';
  };



  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dayEntries = getEntriesForDate(date);
      const moodColor = dayEntries.length > 0 ? getMoodColor(dayEntries[0].moods) : null;
      
      days.push(
        <div
          key={i}
          onClick={() => setSelectedDate(date)}
          className={`calendar-day ${
            dayEntries.length > 0 ? 'has-entries' : ''
          } ${
            date.getMonth() !== currentMonth ? 'inactive' : ''
          }`}
          style={{
            backgroundColor: moodColor || (dayEntries.length > 0 ? '#0ABAB5' : 'white'),
            color: dayEntries.length > 0 ? 'white' : '#333'
          }}
        >
          <div>{date.getDate()}</div>
          {dayEntries.length > 0 && <div style={{ fontSize: '12px', marginTop: '2px' }}>📝</div>}
        </div>
      );
    }
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map(day => (
            <div key={day} className="calendar-header-day">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days}
        </div>
        
        {selectedDate && (
          <div className="card">
            <h3>{selectedDate.toLocaleDateString('ru-RU')}</h3>
            {getEntriesForDate(selectedDate).length > 0 ? (
              <>
                {getEntriesForDate(selectedDate).map(entry => (
                  <div key={entry.id} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{getMoodEmojis(entry.moods)}</span>
                    </div>
                    {entry.music && (
                      <div className="calendar-music-item" style={{ justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }} onClick={() => playTrack(entry.music.track)}>
                          <span>{currentTrack === entry.music.track && isPlaying ? '⏸️' : '▶️'}</span>
                          <span style={{ marginLeft: '8px' }}>🎵 {entry.music.track}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(entry.music.track);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: isLiked(entry.music.track) ? '#ff4757' : '#999',
                            padding: '2px'
                          }}
                        >
                          {isLiked(entry.music.track) ? '❤️' : '🤍'}
                        </button>
                      </div>
                    )}
                    {entry.note && (
                      <div style={{ fontSize: '14px', fontStyle: 'italic' }}>{entry.note}</div>
                    )}
                  </div>
                ))}
                

              </>
            ) : (
              <p>Нет записей за этот день</p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Ваш дневник настроений</h2>
      </div>
      
      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button 
          className={viewMode === 'list' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setViewMode('list')}
          style={{ 
            minWidth: '120px',
            width: 'auto'
          }}
        >
          📝 Список
        </button>
        <button 
          className={viewMode === 'calendar' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setViewMode('calendar')}
          style={{ 
            minWidth: '120px',
            width: 'auto'
          }}
        >
          📅 Календарь
        </button>
      </div>
      
      {viewMode === 'calendar' ? renderCalendar() : (
        entries.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎵</div>
          <h3>Пока нет записей</h3>
          <p>Начните отслеживать свои настроения!</p>
          <button 
            className="btn btn-primary full-width" 
            onClick={() => navigate('/mood')}
            style={{ marginTop: '20px' }}
          >
            Добавить запись
          </button>
        </div>
      ) : (
        <>
          {entries.map(entry => (
            <div key={entry.id} className="diary-entry">
              <div className="entry-header">
                <div style={{ fontWeight: 'bold' }}>{formatDate(entry.date)}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ color: '#718096', fontSize: '14px' }}>
                    {new Date(entry.date).toLocaleTimeString('ru-RU', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <button 
                    onClick={() => startEdit(entry)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4a5568',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteEntry(entry.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e53e3e',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>
                  Настроение:
                </div>
                <div className="moods-display">
                  <div className="mood-emojis">{getMoodEmojis(entry.moods)}</div>
                  <div>
                    {Object.entries(entry.moods).map(([moodId, data]) => (
                      <div key={moodId} style={{ fontSize: '12px', color: '#888' }}>
                        {moodId}: {Math.round(data.intensity)}%
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {entry.music && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>
                    Музыка:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '10px' }}>🎵</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{entry.music.track}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{entry.music.playlist}</div>
                    </div>
                  </div>
                </div>
              )}

              {entry.note && (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>
                    Заметка:
                  </div>
                  {editingEntry === entry.id ? (
                    <div>
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          resize: 'vertical',
                          minHeight: '60px'
                        }}
                      />
                      <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => saveEdit(entry.id)}
                          style={{
                            padding: '4px 12px',
                            background: '#4a5568',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Сохранить
                        </button>
                        <button 
                          onClick={cancelEdit}
                          style={{
                            padding: '4px 12px',
                            background: '#e2e8f0',
                            color: '#4a5568',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="note-text">{entry.note}</div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/mood')}
              style={{ minWidth: '200px' }}
            >
              ➕ Добавить новую запись
            </button>
          </div>
        </>
        )
      )}
      

    </div>
  );
}

export default DiaryPage;