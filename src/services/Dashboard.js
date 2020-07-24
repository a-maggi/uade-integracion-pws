import { handleResponse } from '../_helpers';
import { authenticationService } from './Auth';
const { REACT_APP_apiUrl } = process.env;

export const DashboardService = {
  fetchEmployees,
  fetchHours,
  modifyEmployee,
  createEmployee,
  removeEmployee
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

function modifyEmployee(data) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json',  Authorization: 'Bearer '+authenticationService.user.jwt},
    body: JSON.stringify({
      "firstName": data.firstName,
      "lastName": data.lastName,
      "document": data.document,
      "startDate": data.startDate,
      "taxNumber": data.taxNumber,
      "hoursPerMonth": data.hoursPerMonth,
    })
  };

  return fetch(`${REACT_APP_apiUrl}/employees/${data.id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function createEmployee(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',  Authorization: 'Bearer '+authenticationService.user.jwt},
    body: JSON.stringify({
      "firstName": data.firstName,
      "lastName": data.lastName,
      "document": data.document,
      "startDate": data.startDate,
      "taxNumber": data.taxNumber,
      "hoursPerMonth": data.hoursPerMonth,
    })
  };

  return fetch(`${REACT_APP_apiUrl}/employees`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function removeEmployee(data) {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json',  Authorization: 'Bearer '+authenticationService.user.jwt},
  };

  return fetch(`${REACT_APP_apiUrl}/employees/${data.id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}


function fetchHours() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',  Authorization: 'Bearer '+authenticationService.user.jwt},
  };

  return fetch(`${REACT_APP_apiUrl}/hours`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}
