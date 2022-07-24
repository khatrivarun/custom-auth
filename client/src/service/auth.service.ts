import axios from 'axios';

const publicServer = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

const authorizedServer = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

publicServer.interceptors.request.use((config) => {
  config['withCredentials'] = true;

  return config;
});

authorizedServer.interceptors.request.use((config) => {
  config['withCredentials'] = true;

  return config;
});

authorizedServer.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalConfig = error.config;

    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        console.log('Refreshing Token');
        originalConfig._retry = true;

        try {
          await fetchNewAccessToken();

          return authorizedServer(originalConfig);
        } catch (_error: any) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }
    }
  }
);

export const fetchNewAccessToken = async (): Promise<void> => {
  await publicServer.post('api/v1/auth/refresh/');
};

export const getCookie = async (): Promise<void> => {
  await publicServer.post('api/v1/auth/lol/');
};

export const getUser = async (): Promise<void> => {
  const response = await authorizedServer.get(`/api/v1/auth/me/`);

  const responseJson = await response.data;
  console.log(responseJson);
};

export const login = async (): Promise<void> => {
  await publicServer.post(`/api/v1/auth/login/`, {
    username: 'jsmith',
    password: 'test123',
  });
};

