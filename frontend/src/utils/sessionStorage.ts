export const setSessionStorage = (key: string, value: unknown) => {
  window.sessionStorage.setItem(key, JSON.stringify(value));
};

export const getSessionStorage = (key: string) => {
  const item = window.sessionStorage.getItem(key);
  if (item) return JSON.parse(item);
  return null;
};
