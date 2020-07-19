import { handleResponse } from '../_helpers';
import { authenticationService } from './Auth';
const { REACT_APP_apiUrl } = process.env;

export const DashboardService = {
  fetchEmployees
};

function fetchEmployees() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  Authorization: 'Bearer '+authenticationService.user.jwt},
  };

  return fetch(`${REACT_APP_apiUrl}/employees`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}
