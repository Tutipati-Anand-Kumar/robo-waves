import api from "../../api/api";



export const sendFollowRequestAPI = async (targetUsername, token) => {
  const { data } = await api.post(
    `/follow/send-request`,
    { targetUsername },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};


export const acceptFollowRequestAPI = async (followerId, token) => {
  const { data } = await api.post(
    `/follow/accept-request`,
    { followerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};


export const rejectFollowRequestAPI = async (followerId, token) => {
  const { data } = await api.post(
    `/follow/reject-request`,
    { followerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
};