import React, { useState } from 'react';

function MiniPlayer({ track, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!isPlaying) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 3);
      
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  if (!track) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      borderRadius: '15px',
      padding: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 1001,
      maxWidth: '350px',
      width: '90%'
    }}>
      <button 
        onClick={togglePlay}
        style={{
          background: '#0ABAB5',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{track}</div>
        <div style={{ fontSize: '12px', color: '#666' }}>Из дневника</div>
      </div>
      
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          color: '#999'
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default MiniPlayer;