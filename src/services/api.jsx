import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://willowy-heddie-kinal65-1b21ad59.koyeb.app/EmpleaYa/v2/',
    timeout: 5000
})

//

apiClient.interceptors.request.use(config => {
  const stored = localStorage.getItem('user')
  if (stored) {
    const { token } = JSON.parse(stored)
    if (token) config.headers['x-token'] = token
  }
  return config
})

// == Auth ==
export const login = async (data) => {
  try {
    return await apiClient.post('/auth/login', data);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const register = async (data) => {
  try {
    return await apiClient.post('/auth/register', data);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const definirRol = async (formData) => {
  try {
    return await apiClient.put(
      '/auth/definir-rol',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  } catch (e) {
    return { error: true, ...e };
  }
};

//Company
export const fetchCompanies = async () => {
  try {
    return await apiClient.get('/companies');
  } catch (e) {
    return { error: true, ...e };
  }
};

export const fetchCompany = async (id) => {
  try {
    return await apiClient.get(`/companies/${id}`);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const createCompany = async (data) => {
  try {
    return await apiClient.post('/companies', data);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const updateCompany = async (id, data) => {
  try {
    return await apiClient.put(`/companies/${id}`, data);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const deleteCompany = async (id) => {
  try {
    return await apiClient.delete(`/companies/${id}`);
  } catch (e) {
    return { error: true, ...e };
  }
};

//Users
// Perfil
export const fetchUsers = async () => {
  try {
    return await apiClient.get('/users');
  } catch (e) {
    return { error: true, ...e };
  }
};

export const fetchUser = async id => {
  try {
    return await apiClient.get(`/users/${id}`);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const updateUser = async (id, data) => {
  try {
    return await apiClient.put(`/users/${id}`, data);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const deleteUser = async id => {
  try {
    return await apiClient.delete(`/users/${id}`);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const updateUserProfilePicture = async (id, formData) => {
  try {
    return await apiClient.put(
      `/users/${id}/upload-photo`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  } catch (e) {
    return { error: true, ...e };
  }
};

export const uploadUserCv = async (id, formData) => {
  try {
    return await apiClient.put(
      `/users/${id}/upload-cv`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  } catch (e) {
    return { error: true, ...e };
  }
};

// == Usuario actual “/me” ==
export const fetchProfile = async () => {
  try {
    const res = await apiClient.get('users/me/')
    return { data: res.data, status: res.status }
  } catch (e) {
    return { error: true, msg: e.response?.data?.msg || e.message }
  }
}

export const updateProfile = async payload => {
  try {
    const res = await apiClient.put('users/me', payload)
    return { data: res.data, status: res.status }
  } catch (e) {
    return { error: true, msg: e.response?.data?.msg || e.message }
  }
}

export const deleteCurrentUser = async () => {
  try {
    const res = await apiClient.delete('users/me')
    return { data: res.data, status: res.status }
  } catch (e) {
    return { error: true, msg: e.response?.data?.msg || e.message }
  }
}

export const updateProfilePictureMe = async formData => {
  try {
    return await apiClient.put(
      '/users/me/upload-photo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  } catch (e) {
    return { error: true, ...e };
  }
};

export const uploadCvMe = async formData => {
  try {
    return await apiClient.put(
      '/users/me/upload-cv',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  } catch (e) {
    return { error: true, ...e };
  }
};

export const changePassword = async ({ actual, nueva }) => {
  try {
    return await apiClient.put('/users/me/change-password', { actual, nueva });
  } catch (e) {
    return { error: true, ...e };
  }
};

//Jobs
export const fetchJobs = async (params = {}) => {
  try {
    const allParams = { ...params, t: Date.now() };
    const qs = new URLSearchParams(allParams).toString();
    return await apiClient.get(`/jobs?${qs}`);
  } catch (e) {
    return { error: true, ...e };
  }
};


export const fetchJob = async (id) => {
  try {
    return await apiClient.get(`/jobs/${id}`);
  } catch (e) {
    return { error: true, ...e };
  }
};

export const fetchMyJobs = async () => {
  try {
    const res = await apiClient.get('/jobs/my');
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, response: e.response, message: e.message };
  }
};

export const createJob = async data => {
  try {
    const res = await apiClient.post('/jobs', data);
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, response: e.response, message: e.message };
  }
};

export const updateJob = async (id, data) => {
  try {
    const res = await apiClient.put(`/jobs/${id}`, data);
    return { data: res.data, status: res.status };
  } catch (e) {
    return {
      error: true,
      response: e.response,
      message: e.response?.data?.msg || e.message
    };
  }
};

export const updateApplicationStatus = async (id, estado) => {
  try {
    const res = await apiClient.put(`/applications/${id}/estado`, { estado });
    return { data: res.data, status: res.status };
  } catch (e) {
    return {
      error:   true,
      message: e.response?.data?.msg || e.message,
      response: e.response
    };
  }
};

export const deleteJob = async (id) => {
  try {
    // usa apiClient, no clienteAxios
    const response = await apiClient.delete(`/jobs/${id}`)
    // response.data debería contener { msg, empleo } según tu back
    return response.data
  } catch (error) {
    // propaga el error con su payload para poder manejarlo en UI
    return Promise.reject(error.response?.data || error)
  }
}

export const fetchApplicationsByJob = async (jobId) => {
  try {
    const res = await apiClient.get(`/applications/job/${jobId}`);
    return { data: res.data, status: res.status };
  } catch (e) {
    return {
      error:   true,
      message: e.response?.data?.msg || e.message,
      response: e.response
    };
  }
};

export const fetchCompanyApplications = async () => {
  try {
    const res = await apiClient.get('/applications/company');
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, message: e.response?.data?.msg || e.message };
  }
};



//Notifications
export const fetchNotifications = async () => {
  try { return await apiClient.get('notifications'); }
  catch (e) { return { error: true, ...e }; }
};

export const markNotificationRead = async id => {
  try { return await apiClient.put(`notifications/${id}/read`); }
  catch (e) { return { error: true, ...e }; }
};

// == Applications ==
export const fetchApplications = async () => {
  try { return await apiClient.get('/applications/user/'); }
  catch (e) { return { error: true, ...e }; }
};

export const applyToJob = async (jobId, data = {}) => {
  try {
    return await apiClient.post(`/applications/`, { job: jobId, ...data });
  } catch (e) {
    return { error: true, ...e };
  }
};

// == Messages ==
export const fetchMessages = async () => {
  try { return await apiClient.get('messages'); }
  catch (e) { return { error: true, ...e }; }
};

export const fetchConversationsSummary = async () => {
  try {
    const res = await apiClient.get('/messages/inbox');
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, message: e.response?.data?.msg || e.message };
  }
};

export const fetchConversation = async contactId => {
  try {
    const res = await apiClient.get(`/messages/convo/${contactId}`);
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, message: e.response?.data?.msg || e.message };
  }
};

export const sendMessage = async (toUserId, message) => {
  try {
    const res = await apiClient.post('/messages', { to: toUserId, message });
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, message: e.response?.data?.msg || e.message };
  }
};

export const markAsRead = async contactId => {
  try {
    const res = await apiClient.put(`/messages/read/${contactId}`);
    return { data: res.data, status: res.status };
  } catch (e) {
    return { error: true, message: e.response?.data?.msg || e.message };
  }
};

export const fetchUnreadCount = async () => {
  try {
    const res = await apiClient.get('/messages/notificaciones/unread');
    return { data: res.data.totalNoLeidos, status: res.status };
  } catch (e) {
    return { error: true, message: e.response?.data?.msg || e.message };
  }
};

export default apiClient;