// frontend/src/utils/auth.js

export const isLoggedIn = async (authApi) => {
  try {
    await authApi.me();
    return true;
  } catch {
    return false;
  }
};
