import { handleResponse } from '../_helpers';
const { REACT_APP_apiUrl } = process.env;

export const PublicService = {
  NewSign,
  fetchCustomers
};

function fetchCustomers() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };

  return fetch(`${REACT_APP_apiUrl}/customers`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}
function NewSign(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  return fetch(`${REACT_APP_apiUrl}/signeds`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}
