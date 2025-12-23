const API_BASE_URL = 'http://localhost:3001';
const CURRENT_USER_ID = 1;

class ApiService {
  async getDiaryEntries() {
    const response = await fetch(`${API_BASE_URL}/diary_entries?userId=${CURRENT_USER_ID}`);
    return response.json();
  }

  async createDiaryEntry(entry) {
    const response = await fetch(`${API_BASE_URL}/diary_entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...entry, userId: CURRENT_USER_ID, id: Date.now() })
    });
    return response.json();
  }

  async getLikedTracks() {
    const response = await fetch(`${API_BASE_URL}/liked_tracks?userId=${CURRENT_USER_ID}`);
    const tracks = await response.json();
    return tracks.map(item => item.track);
  }

  async toggleLikedTrack(track) {
    const tracks = await fetch(`${API_BASE_URL}/liked_tracks?userId=${CURRENT_USER_ID}&track=${track}`);
    const existing = await tracks.json();
    
    if (existing.length > 0) {
      await fetch(`${API_BASE_URL}/liked_tracks/${existing[0].id}`, {
        method: 'DELETE'
      });
      return false;
    } else {
      await fetch(`${API_BASE_URL}/liked_tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: CURRENT_USER_ID, track, id: Date.now() })
      });
      return true;
    }
  }

  async updateUserProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/users/${CURRENT_USER_ID}`);
    return response.json();
  }
  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  }

  async getAllDiaryEntries() {
    const response = await fetch(`${API_BASE_URL}/diary_entries`);
    return response.json();
  }

  async getAllLikedTracks() {
    const response = await fetch(`${API_BASE_URL}/liked_tracks`);
    return response.json();
  }
}

export default new ApiService();