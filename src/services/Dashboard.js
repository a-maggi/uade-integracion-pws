import { handleResponse } from '../_helpers';
import { authenticationService } from './Auth';
import moment from 'moment';
const { REACT_APP_apiUrl } = process.env;

export const DashboardService = {
  fetchEmployees,
  fetchHours,
  modifyEmployee,
  createEmployee,
  removeEmployee,
  fetchCustomers,
  fetchBills,
  setApproveBill,
  modifyHours,
  createHours,
  approvedHours,
  rejectHours,
  creatBills,
  sendNews
};



function sendNews(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify(data)
  };

  return fetch(`${REACT_APP_apiUrl}/clearings`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function creatBills(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify(data)
  };

  return fetch(`${REACT_APP_apiUrl}/bills`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function fetchEmployees() {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
  };

  return fetch(`${REACT_APP_apiUrl}/employees`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}
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


function fetchBills(customer) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
  };

  return fetch(`${REACT_APP_apiUrl}/bills?customer=${customer}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}



function setApproveBill(id) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify({
      "charged": true,
    })
  };

  return fetch(`${REACT_APP_apiUrl}/bills/${id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function modifyEmployee(data) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify({
      "firstName": data.firstName,
      "lastName": data.lastName,
      "document": data.document,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "taxNumber": data.taxNumber,
      "hoursPerMonth": data.hoursPerMonth,
      "jobStart": moment(data.jobStart, "H:mm:ss.SSS", true).isValid() ? data.jobStart : data.jobStart + ":00.000",
      "jobEnd": moment(data.jobEnd, "H:mm:ss.SSS", true).isValid() ? data.jobEnd : data.jobEnd + ":00.000",
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
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify({
      "firstName": data.firstName,
      "lastName": data.lastName,
      "document": data.document,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "taxNumber": data.taxNumber,
      "hoursPerMonth": data.hoursPerMonth,
      "jobStart": data.jobStart + ":00.000",
      "jobEnd": data.jobEnd + ":00.000",
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
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
  };

  return fetch(`${REACT_APP_apiUrl}/employees/${data.id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}


function modifyHours(data) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify({
      "newProposalEgressDatetime": data.egressSignedDatetime,
      "newProposalEntryDatetime": data.entrySignedDatetime,
      "justified": data.justified,
      "approved": data.approved,
    })
  };

  return fetch(`${REACT_APP_apiUrl}/hours/${data.id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}


function approvedHours(data) {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify({
      "approved": true,
      "revision": true, 
      "newProposalEgressDatetime": data.newProposalEgressDatetime,
      "newProposalEntryDatetime": data.newProposalEntryDatetime,
    })
  };

  return fetch(`${REACT_APP_apiUrl}/hours/${data.id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}
function rejectHours(data) {
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
  };

  return fetch(`${REACT_APP_apiUrl}/hours/${data.id}`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function createHours(data) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
    body: JSON.stringify({
      "newProposalEgressDatetime": data.egressSignedDatetime,
      "newProposalEntryDatetime": data.entrySignedDatetime,
      "approved": data.approved ? true : false,
      "type": data.type,
    })
  };

  return fetch(`${REACT_APP_apiUrl}/hours`, requestOptions)
    .then(handleResponse)
    .then(res => {
      return res;
    });
}

function fetchHours(filters) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authenticationService.user().jwt },
  };
  if (filters) {
    if (filters == 'signed') {
      return fetch(`${REACT_APP_apiUrl}/hours?type=signed&type=update&approved=true`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    }
    else if (filters == 'licence') {
      return fetch(`${REACT_APP_apiUrl}/hours?type=holiday&type=study`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    }
    else if (filters == 'toApprove') {
      return fetch(`${REACT_APP_apiUrl}/hours?approved=false`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    } else if (filters.employee && filters.dateFrom && filters.dateTo)
      return fetch(`${REACT_APP_apiUrl}/hours?type=signed&type=update&approved=true&createdAt_gte=${filters.dateFrom}&createdAt_lte=${filters.dateTo}&employee=${filters.employee}`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    else if (filters.dateFrom && filters.dateTo)
      return fetch(`${REACT_APP_apiUrl}/hours?type=signed&type=update&approved=true&createdAt_gte=${filters.dateFrom}&createdAt_lte=${filters.dateTo}`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    else if (filters.employee)
      return fetch(`${REACT_APP_apiUrl}/hours?type=signed&type=update&approved=true&employee=${filters.employee}`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    else if (filters.type)
      return fetch(`${REACT_APP_apiUrl}/hours?type=${filters.type}`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
    else
      return fetch(`${REACT_APP_apiUrl}/hours`, requestOptions)
        .then(handleResponse)
        .then(res => {
          return res;
        });
  }
}
