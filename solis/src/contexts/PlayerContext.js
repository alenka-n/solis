import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import ApiService from '../services/api';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [likedTracks, setLikedTracks] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    loadLikedTracks();
    return () => {
      if (audioRef.current?.interval) {
        clearInterval(audioRef.current.interval);
      }
    };
  }, []);

  const loadLikedTracks = async () => {
    try {
      const tracks = await ApiService.getLikedTracks();
      setLikedTracks(tracks);
    } catch (error) {
      const fallback = JSON.parse(localStorage.getItem('likedTracks') || '[]');
      setLikedTracks(fallback);
    }
  };

  const playTrack = (track) => {
    console.log('Global player: trying to play track:', track);
    
    if (currentTrack === track && isPlaying) {
      // Пауза - останавливаем аудио
      setIsPlaying(false);
      if (audioRef.current?.interval) {
        clearInterval(audioRef.current.interval);
      }
      if (audioRef.current?.audio) {
        audioRef.current.audio.pause();
      }
      return;
    }
    
    if (currentTrack === track && !isPlaying) {
      // Возобновление с текущего времени
      setIsPlaying(true);
      if (audioRef.current?.audio) {
        audioRef.current.audio.play();
      }
      return;
    }
    
    // Новый трек - останавливаем предыдущий
    if (audioRef.current?.interval) {
      clearInterval(audioRef.current.interval);
    }
    if (audioRef.current?.audio) {
      audioRef.current.audio.pause();
    }
    
    setCurrentTrack(track);
    setCurrentTime(0);
    setIsPlaying(true);
    
    // Попытка воспроизвести реальный аудио файл
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
    
    const audioFile = trackFiles[track];
    console.log('Audio file path:', audioFile);
    
    if (audioFile) {
      const audio = new Audio(audioFile);
      audio.volume = 0.7;
      
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setIsPlaying(false);
      };
      
      audio.oncanplay = () => {
        console.log('Audio can play:', audioFile);
      };
      
      audio.onloadedmetadata = () => {
        setDuration(Math.floor(audio.duration));
      };
      
      audio.ontimeupdate = () => {
        setCurrentTime(Math.floor(audio.currentTime));
      };
      
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.play().then(() => {
        console.log('Audio started playing successfully');
      }).catch((error) => {
        console.error('Audio play failed:', error);
        setIsPlaying(false);
      });
      
      audioRef.current = { audio };
    } else {
      console.error('No audio file found for track:', track);
    }
  };

  const stopPlayer = () => {
    if (audioRef.current?.interval) {
      clearInterval(audioRef.current.interval);
    }
    if (audioRef.current?.audio) {
      audioRef.current.audio.pause();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleLike = async (track) => {
    console.log('toggleLike called for track:', track);
    console.log('Current likedTracks:', likedTracks);
    
    // Сразу используем localStorage, так как API не работает
    const newLikedTracks = likedTracks.includes(track)
      ? likedTracks.filter(t => t !== track)
      : [...likedTracks, track];
    
    console.log('New likedTracks:', newLikedTracks);
    setLikedTracks(newLikedTracks);
    localStorage.setItem('likedTracks', JSON.stringify(newLikedTracks));
  };

  const isLiked = (track) => likedTracks.includes(track);

  return (
    <PlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      playTrack,
      stopPlayer,
      formatTime,
      likedTracks,
      toggleLike,
      isLiked
    }}>
      {children}
    </PlayerContext.Provider>
  );
};