const API_BASE = '/api';

export const api = {
  async registerUser(name: string): Promise<string> {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to register');
    return id;
  },
  async getUser(id: string) {
    const res = await fetch(`${API_BASE}/users/${id}`);
    if (!res.ok) throw new Error('User not found');
    return await res.json();
  },
  async saveProgress(userId: string, moduleId: string, score: number, passed: boolean) {
    await fetch(`${API_BASE}/progress/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId, score, passed }),
    });
  },
  getCertificateUrl(userId: string) {
    return `${API_BASE}/certificate/${userId}`;
  }
};
