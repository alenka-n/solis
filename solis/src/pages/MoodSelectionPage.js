import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOODS = [
  { id: 'happy', name: 'Счастье', emoji: '😊' },
  { id: 'sad', name: 'Грусть', emoji: '😢' },
  { id: 'angry', name: 'Злость', emoji: '😠' },
  { id: 'calm', name: 'Спокойствие', emoji: '😌' },
  { id: 'excited', name: 'Возбуждение', emoji: '🤩' },
  { id: 'anxious', name: 'Тревога', emoji: '😰' },
  { id: 'love', name: 'Любовь', emoji: '🥰' },
  { id: 'tired', name: 'Усталость', emoji: '😴' }
];

function MoodSelectionPage() {
  const [selectedMoods, setSelectedMoods] = useState({});
  const navigate = useNavigate();

  const toggleMood = (moodId) => {
    setSelectedMoods(prev => ({
      ...prev,
      [moodId]: prev[moodId] ? undefined : { intensity: 50 }
    }));
  };

  const updateIntensity = (moodId, intensity) => {
    setSelectedMoods(prev => ({
      ...prev,
      [moodId]: { intensity }
    }));
  };

  const generateMusic = () => {
    const selected = Object.keys(selectedMoods).filter(id => selectedMoods[id]);
    if (selected.length === 0) {
      alert('Выберите хотя бы одну эмоцию');
      return;
    }
    navigate('/music', { state: { moods: selectedMoods } });
  };

  return (
    <div className="container">
      <div className="header">
        <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>Как вы себя чувствуете?</h2>
      </div>
      
      <div className="moods-grid">
        {MOODS.map(mood => (
          <div key={mood.id}>
            <div
              className={`mood-card ${selectedMoods[mood.id] ? 'selected' : ''}`}
              onClick={() => toggleMood(mood.id)}
            >
              <div className="mood-emoji">{mood.emoji}</div>
              <div className="mood-name">{mood.name}</div>
            </div>
            
            {selectedMoods[mood.id] && (
              <div className="slider-container">
                <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                  Интенсивность: {Math.round(selectedMoods[mood.id].intensity)}%
                </div>
                <input
                  type="range"
                  className="slider"
                  min="10"
                  max="100"
                  value={selectedMoods[mood.id].intensity}
                  onChange={(e) => updateIntensity(mood.id, parseInt(e.target.value))}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button className="btn btn-primary" onClick={generateMusic}>
        Найти музыку
      </button>
    </div>
  );
}

export default MoodSelectionPage;