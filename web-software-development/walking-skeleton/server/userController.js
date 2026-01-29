import * as userRepository from "./userRepository.js";

const getAllUsers = async (c) => {
  const users = await userRepository.getAllUsers();
  return c.json(users);
};

const getSystemStats = async (c) => {
  const stats = await userRepository.getSystemStats();
  return c.json(stats);
};

export { getAllUsers, getSystemStats };