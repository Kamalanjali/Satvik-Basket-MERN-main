let listeners = [];

export const subscribeAuth = (cb) => {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
};

export const notifyAuthChanged = () => {
  listeners.forEach((cb) => cb());
};