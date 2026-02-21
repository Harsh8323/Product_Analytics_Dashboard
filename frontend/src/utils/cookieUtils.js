import Cookies from 'js-cookie';

export const setCookie = (name, value, days = 7) => {
  Cookies.set(name, JSON.stringify(value), { expires: days, sameSite: 'strict' });
};

export const getCookie = (name) => {
  const value = Cookies.get(name);
  return value ? JSON.parse(value) : null;
};

export const removeCookie = (name) => {
  Cookies.remove(name);
};