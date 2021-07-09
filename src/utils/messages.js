const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const location = (username, address, link) => {
  return {
    username,
    address,
    link,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  location,
};
