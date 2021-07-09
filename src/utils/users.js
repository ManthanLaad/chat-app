const Filter = require("bad-words");

const users = [];

const addUser = ({ id, username, room }) => {
  // String formatting
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Null check
  if (!username || !room) {
    return {
      error: "Username and room are required",
    };
  }

  // Profanity Check
  const filter = new Filter();
  if (filter.isProfane(username) || filter.isProfane(room)) {
    return { error: "Profanity is not allowed" };
  }

  // Existing user check
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username has been taken",
    };
  }

  // Accepted
  const user = { id, username, room };
  users.push(user);
  return { user };
};

// Remove User
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1);
  }
};

// Get User by ID
const getUser = (id) => {
  return users.find((user) => user.id === id);
};

// Get User by Room
const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room.trim().toLowerCase());
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
