const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const location = (address, link) => {
  return {
    address,
    link,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  location,
};
