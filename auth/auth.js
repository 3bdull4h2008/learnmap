const API_BASE = window.SITE_API_URL || '/api';

const Auth = {
  getToken() {
    return localStorage.getItem('learnmap_token');
  },

  setToken(token) {
    localStorage.setItem('learnmap_token', token);
  },

  removeToken() {
    localStorage.removeItem('learnmap_token');
  },

  getUser() {
    try {
      const u = localStorage.getItem('learnmap_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  },

  setUser(user) {
    localStorage.setItem('learnmap_user', JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem('learnmap_user');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  clearAuth() {
    this.removeToken();
    this.removeUser();
  },

  async getHeaders() {
    const h = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  async request(endpoint, options = {}) {
    const headers = await this.getHeaders();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
  },

  async register(name, email, password) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async loginWithGoogle(credential) {
    const data = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential })
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  logout() {
    this.clearAuth();
    this.request('/auth/logout').catch(() => {});
    window.location.href = '/index.html';
  },

  async getMe() {
    const data = await this.request('/auth/me');
    this.setUser(data.data);
    return data.data;
  },

  async checkAuth() {
    try {
      const data = await this.request('/auth/me');
      this.setUser(data.data);
      return data.data;
    } catch {
      return this.getUser();
    }
  },

  async updateProfile(profile) {
    const data = await this.request('/auth/updateprofile', {
      method: 'PUT',
      body: JSON.stringify({ profile })
    });
    this.setUser(data.data);
    return data.data;
  },

  async updateAvatar(avatarDataUrl) {
    const data = await this.request('/auth/avatar', {
      method: 'PUT',
      body: JSON.stringify({ avatar: avatarDataUrl })
    });
    this.setUser(data.user);
    return data.user;
  },

  async saveTestResult(testType, results) {
    return await this.request('/auth/test-result', {
      method: 'POST',
      body: JSON.stringify({ testType, results })
    });
  },

  async getTestResults() {
    const data = await this.request('/auth/test-results');
    return data.data;
  },

  async matchUniversities(criteria) {
    const data = await this.request('/universities/match', {
      method: 'POST',
      body: JSON.stringify(criteria)
    });
    return data.data;
  },

  async getFields() {
    const data = await this.request('/universities/fields');
    return data.data;
  },

  async getCities() {
    const data = await this.request('/universities/cities');
    return data.data;
  },

  async getAllMajors() {
    const data = await this.request('/universities/majors/all');
    return data.data;
  }
};

window.LearnMapAuth = Auth;
