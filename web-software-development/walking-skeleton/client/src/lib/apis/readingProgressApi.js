import { PUBLIC_API_URL } from "$env/static/public";
import { authFetch } from "$lib/utils/fetchUtils.js";

const updateProgress = async (bookId, status) => {
  return await authFetch(`${PUBLIC_API_URL}/api/reading-progress/book/${bookId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
};

const getProgressForBook = async (bookId) => {
  return await authFetch(`${PUBLIC_API_URL}/api/reading-progress/book/${bookId}`);
};

const getUserProgress = async (status = null) => {
  const url = status
    ? `${PUBLIC_API_URL}/api/reading-progress?status=${status}`
    : `${PUBLIC_API_URL}/api/reading-progress`;
  return await authFetch(url);
};

const deleteProgress = async (bookId) => {
  return await authFetch(`${PUBLIC_API_URL}/api/reading-progress/book/${bookId}`, {
    method: "DELETE",
  });
};

export { updateProgress, deleteProgress, getProgressForBook, getUserProgress };