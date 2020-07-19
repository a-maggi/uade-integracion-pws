import { handleResponse } from '../_helpers';

const { REACT_APP_apiUrl } = process.env;

export const authenticationService = {
  login,
  logout,
  user: JSON.parse(localStorage.getItem('user'))
};

function login(username, password) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ "identifier": username, "password": password })
  };

  return fetch(`${REACT_APP_apiUrl}/auth/local`, requestOptions)
    .then(handleResponse)
    .then(user => {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem('user');
}