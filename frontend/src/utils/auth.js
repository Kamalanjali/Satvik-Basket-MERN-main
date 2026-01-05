export const isLoggedIn = async (authApi) => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    await authApi.me();
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
};
