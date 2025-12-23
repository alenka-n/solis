import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

function GlobalPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, playTrack, stopPlayer, formatTime, toggleLike, isLiked } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 1001,
      maxWidth: '400px',
      width: '90%'
    }}>
      <button 
        onClick={() => playTrack(currentTrack)}
        style={{
          background: '#4a5568',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#2d3748'}
        onMouseOut={(e) => e.target.style.background = '#4a5568'}
      >
        {isPlaying ? '||' : '▶'}
      </button>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', fontSize: '14px', color: '#2d3748' }}>{currentTrack}</div>
        <div style={{ fontSize: '12px', color: '#718096' }}>
          {formatTime(currentTime)} / {formatTime(duration || 0)}
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e2e8f0',
          borderRadius: '2px',
          marginTop: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            height: '100%',
            backgroundColor: '#4a5568',
            transition: 'width 0.3s ease',
            borderRadius: '2px'
          }} />
        </div>
      </div>
      
      <button 
        onClick={() => toggleLike(currentTrack)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          color: isLiked(currentTrack) ? '#e53e3e' : '#a0aec0',
          padding: '6px',
          borderRadius: '6px',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#f7fafc'}
        onMouseOut={(e) => e.target.style.background = 'none'}
        title={isLiked(currentTrack) ? 'Убрать из понравившихся' : 'Добавить в понравившиеся'}
      >
        {isLiked(currentTrack) ? '♥' : '♡'}
      </button>
      
      <button 
        onClick={stopPlayer}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          color: '#a0aec0',
          padding: '6px',
          borderRadius: '6px',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = '#f7fafc'}
        onMouseOut={(e) => e.target.style.background = 'none'}
      >
        ✕
      </button>
    </div>
  );
}

export default GlobalPlayer;