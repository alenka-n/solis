import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';
import ApiService from '../services/api';

function MusicPlayerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { moods } = location.state || { moods: { happy: { intensity: 70 } } }; // Дефолтное настроение
  const [playlists, setPlaylists] = useState([]);
  const { playTrack: playGlobalTrack, currentTrack, likedTracks, toggleLike, isLiked } = usePlayer();
  const [activeTab, setActiveTab] = useState('mood');
  const [note, setNote] = useState('');

  useEffect(() => {
    const moodTracks = {
      happy: ['Sabrina Carpenter - Espresso', 'GONE. Fludd - Рапсодия Конца света', 'Tolan Shaw - Gold'],
      sad: ['ЛСП - Элексир', 'ЛСП - Ууу', 'playingtheangel - не вывожу'],
      angry: ['Иван Рейс - Огонь', 'GONE. Fludd - Баланс', 'playingtheangel - заходим в город'],
      calm: ['Greg Gontier - Je veux', 'Başak Gümülcinelioğlu - Sen Çal Kapımı', 'Мот, Артем Пивоваров - Муссоны'],
      excited: ['ЛСП - Убийца Свин', 'uniqe, nkeeei, ARTEM SHILOVETS, Wipo - ГЛАМУР', 'Иван Рейс - Огонь'],
      anxious: ['Лсп, Gone.Fludd - Кино', 'Потрачу - Егор Крид', 'Танцы - Zoloto'],
      love: ['Юлианна Караулова - Любовники', 'LIRIQ - сохрани', 'Егор Крид - зажигалки'],
      tired: ['шварц - Осень', 'Тимати - Мне наплевать', 'playingtheangel - метауровень']
    };
    
    const selectedMoods = Object.keys(moods);
    const mainMood = selectedMoods[0] || 'happy';
    
    const mockPlaylists = [
      {
        id: 1,
        title: `Музыка для ${mainMood}`,
        tracks: moodTracks[mainMood] || moodTracks.happy
      }
    ];
    setPlaylists(mockPlaylists);
  }, []);

  const playTrack = (playlist, trackIndex) => {
    playGlobalTrack(playlist.tracks[trackIndex]);
  };

  const saveToDiary = async () => {
    if (!currentTrack) {
      alert('Выберите трек для сохранения');
      return;
    }

    const entry = {
      date: new Date().toISOString(),
      moods,
      music: { track: currentTrack, playlist: 'Выбранная музыка' },
      note
    };

    try {
      await ApiService.createDiaryEntry(entry);
      alert('Запись сохранена в дневник!');
    } catch (error) {
      const entries = JSON.parse(localStorage.getItem('diaryEntries') || '[]');
      entries.unshift({ id: Date.now(), ...entry });
      localStorage.setItem('diaryEntries', JSON.stringify(entries));
      alert('Запись сохранена локально!');
    }
    
    navigate('/diary');
  };

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Музыка</h2>
      </div>
      
      <div style={{ 
        marginBottom: '30px', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <button 
          className={activeTab === 'mood' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('mood')}
          style={{ minWidth: '120px', width: 'auto' }}
        >
          🎵 По настроению
        </button>
        <button 
          className={activeTab === 'liked' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('liked')}
          style={{ minWidth: '120px', width: 'auto' }}
        >
          ❤️ Понравившиеся
        </button>
      </div>
      
      {activeTab === 'mood' ? (
        playlists.map(playlist => (
          <div key={playlist.id} className="card">
            <div className="playlist-cover">{playlist.id}</div>
            <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>{playlist.title}</h3>
            <div>
              {playlist.tracks.map((track, index) => (
                <div key={index} className="track-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }} onClick={() => playGlobalTrack(track)}>
                    <span style={{ marginRight: '10px' }}>▶️</span>
                    <span>{track}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer',
                      color: isLiked(track) ? '#ff4757' : '#999',
                      padding: '5px'
                    }}
                  >
                    {isLiked(track) ? '❤️' : '🤍'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <h3 style={{ textAlign: 'center', marginBottom: '15px' }}>Понравившиеся треки</h3>
          {likedTracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🤍</div>
              <p>Пока нет понравившихся треков</p>
              <p>Лайкайте треки, чтобы они появились здесь!</p>
            </div>
          ) : (
            <div>
              {likedTracks.map((track, index) => (
                <div key={index} className="track-item" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }} onClick={() => playGlobalTrack(track)}>
                    <span style={{ marginRight: '10px' }}>▶️</span>
                    <span>{track}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(track);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '16px',
                      cursor: 'pointer',
                      color: '#ff4757',
                      padding: '5px'
                    }}
                  >
                    ❤️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}



      {activeTab === 'mood' && (
        <>
          <div className="card">
            <h3 style={{ marginBottom: '10px' }}>Добавить заметку:</h3>
            <textarea
              className="input"
              placeholder="Что вы чувствуете сейчас?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows="3"
              style={{ resize: 'vertical', minHeight: '80px' }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-primary" onClick={saveToDiary}>
              💾 Сохранить в дневник
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MusicPlayerPage;