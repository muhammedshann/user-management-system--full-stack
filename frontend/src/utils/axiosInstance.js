import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

instance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log('inside of interseptor')
    return config;
  },
  error => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await instance.post('refresh/', {
          refresh: refreshToken,
        });
        console.log('inside of accessing access token');

        localStorage.setItem('accessToken', res.data.access);
        if (res.data.refresh) {
          localStorage.setItem('refreshToken', res.data.refresh);
        }

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return instance(originalRequest);
      } catch (err) {
        console.error('Token refresh failed');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login/';
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
