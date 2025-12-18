import User from "../models/user.model.js";

export const registerUser = async (req, res) => {
  res.json({ message: "Register route working" });
};

export const loginUser = async (req, res) => {
  res.json({ message: "Login route working" });
};

export const getMe = async (req, res) => {
  res.json({ message: "Get me route working" });
};

export const logoutUser = async (req, res) => {
  res.json({ message: "Logout route working" });
};
