let message = "Hello service world!";

const getHello = () => {
  return message;
};

const setHello = (newMessage) => {
  message = newMessage;
};

export { getHello, setHello };