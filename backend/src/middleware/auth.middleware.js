export const protect = (req, res, next) => {
  // TEMPORARY: mock logged-in admin user
  req.user = {
    id: "mock-user-id",
    role: "ADMIN",
    isActive: true
  };

  next();
};
