import axios from 'axios';

const API_URL = 'http://localhost:5000/api/collaboration';

// Create axios instance with auth header
const authAxios = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;
  
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  });
};

// Invite collaborator to recipe
const inviteCollaborator = async (recipeId, email) => {
  const response = await authAxios().post('/invite', { recipeId, email });
  return response.data;
};

// Get collaboration invitations
const getInvitations = async () => {
  const response = await authAxios().get('/invitations');
  return response.data;
};

// Accept invitation
const acceptInvitation = async (invitationId) => {
  const response = await authAxios().post(`/accept/${invitationId}`);
  return response.data;
};

// Reject invitation
const rejectInvitation = async (invitationId) => {
  const response = await authAxios().post(`/reject/${invitationId}`);
  return response.data;
};

// Remove collaborator from recipe
const removeCollaborator = async (recipeId, userId) => {
  const response = await authAxios().delete(`/${recipeId}/collaborators/${userId}`);
  return response.data;
};

const collaborationService = {
  inviteCollaborator,
  getInvitations,
  acceptInvitation,
  rejectInvitation,
  removeCollaborator
};

export default collaborationService;