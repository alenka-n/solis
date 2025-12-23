import React, { useState, useRef, useEffect } from 'react';

function MusicPlayer({ currentTrack, onTrackChange }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrack]);

  const togglePlayback = () => {
    if (!currentTrack) return;

    const trackFiles = {
      'Sabrina Carpenter - Espresso': '/music/Sabrina Carpenter - Espresso.mp3',
      'GONE. Fludd - Рапсодия Конца света': '/music/GONE.Fludd - Рапсодия Конца Света.mp3',
      'Tolan Shaw - Gold': '/music/Gold - Tolan Shaw.mp3',
      'ЛСП - Элексир': '/music/Лсп - Эликсир.mp3',
      'ЛСП - Ууу': '/music/Ууу - ЛСП.mp3',
      'playingtheangel - не вывожу': '/music/playingtheangel - не вывожу.mp3',
      'Иван Рейс - Огонь': '/music/Иван Рейс-Огонь.mp3',
      'GONE. Fludd - Баланс': '/music/GONE.Fludd-Баланс.mp3',
      'playingtheangel - заходим в город': '/music/playingtheangel - заходим в город.mp3',
      'Greg Gontier - Je veux': '/music/Greg Gontier - Je veux.mp3',
      'Başak Gümülcinelioğlu - Sen Çal Kapımı': '/music/Sen Çal Kapımı - Başak Gümülcinelioğlu.mp3',
      'Мот, Артем Пивоваров - Муссоны': '/music/МОТ feat. Артем Пивоваров-Муссоны.mp3',
      'ЛСП - Убийца Свин': '/music/ЛСП-Убийца Свин.mp3',
      'uniqe, nkeeei, ARTEM SHILOVETS, Wipo - ГЛАМУР': '/music/uniqe, nkeeei, ARTEM SHILOVETS, Wipo - ГЛАМУР.mp3',
      'Лсп, Gone.Fludd - Кино': '/music/Лсп, Gone.Fludd - Кино.mp3',
      'Потрачу - Егор Крид': '/music/Потрачу - Егор Крид.mp3',
      'Танцы - Zoloto': '/music/Танцы - Zoloto.mp3',
      'Юлианна Караулова - Любовники': '/music/Любовники - Юлианна Караулова.mp3',
      'LIRIQ - сохрани': '/music/LYRIQ - сохрани.mp3',
      'Егор Крид - зажигалки': '/music/Зажигалки - ЕГОР КРИД.mp3',
      'шварц - Осень': '/music/шварц - Осень.mp3',
      'Тимати - Мне наплевать': '/music/Мне наплевать - Тимати.mp3',
      'playingtheangel - метауровень': '/music/playingtheangel - метауровень.mp3'
    };

    console.log('Toggle clicked, isPlaying:', isPlaying);
    
    if (isPlaying && audioRef.current) {
      console.log('Pausing audio');
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    
    if (!audioRef.current) {
      const audioFile = trackFiles[currentTrack.track];
      if (!audioFile) return;
      
      console.log('Creating new audio:', audioFile);
      const audio = new Audio(audioFile);
      audio.volume = 0.7;
      audioRef.current = audio;
      
      audio.onloadedmetadata = () => setDuration(Math.floor(audio.duration));
      audio.ontimeupdate = () => setCurrentTime(Math.floor(audio.currentTime));
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
    }
    
    console.log('Playing audio');
    audioRef.current.play();
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    console.log('Stop clicked');
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div className="player-container">
        <div style={{ textAlign: 'center', color: '#4a5568' }}>
          Выберите трек для воспроизведения
        </div>
      </div>
    );
  }

  return (
    <div className="player-container">
      <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>Сейчас играет</h3>
      <div className="current-track">
        <div className="track-cover"></div>
        <div className="track-info">
          <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{currentTrack.track}</div>
          <div style={{ color: '#718096', fontSize: '14px' }}>{currentTrack.playlist}</div>
        </div>
        <button className="play-btn" onClick={togglePlayback}>
          {isPlaying ? '||' : '▶'}
        </button>
        <button className="stop-btn" onClick={stopPlayback} style={{marginLeft: '10px'}}>
          ■
        </button>
      </div>
      
      {/* Прогресс бар */}
      <div style={{ marginTop: '15px' }}>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => {
            const newTime = parseInt(e.target.value);
            setCurrentTime(newTime);
          }}
          style={{
            width: '100%',
            height: '4px',
            background: '#ddd',
            borderRadius: '2px',
            marginBottom: '5px',
            cursor: 'pointer'
          }}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          fontSize: '12px', 
          color: '#718096' 
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {isPlaying && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '10px', 
          fontSize: '12px', 
          color: '#4a5568' 
        }}>
          🎵 Играет: {currentTrack.track}
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;