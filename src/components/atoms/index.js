export const saveToLocalStorage = data => {
  window.localStorage.setItem("standy-frontend-login", JSON.stringify(data));
};

export const loadFromLocalStorage = data => {
  const res = window.localStorage.getItem("standy-frontend-login");
  return JSON.parse(res) || {};
};
