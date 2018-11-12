import { set, toggle } from 'cerebral/factories';
import { state, props } from 'cerebral';
import * as actions from './actions';

export const gotoDashboard = [
  actions.getCaseList,
  {
    error: [actions.setAlertError],
    success: [actions.setCaseList],
  },
  set(state`currentPage`, 'Dashboard'),
];
export const gotoLogIn = [
  actions.clearLoginForm,
  set(state`currentPage`, 'LogIn'),
];
export const gotoFilePetition = [
  actions.clearPetition,
  set(state`currentPage`, 'FilePetition'),
];
export const gotoStyleGuide = [set(state`currentPage`, 'StyleGuide')];

export const toggleUsaBannerDetails = [toggle(state`usaBanner.showDetails`)];

export const updateFormValue = [set(state`form.${props`key`}`, props`value`)];

export const submitLogIn = [
  actions.setFormSubmitting,
  actions.getUser,
  {
    error: [actions.setAlertError],
    success: [actions.setUser, actions.navigateToDashboard],
  },
  actions.unsetFormSubmitting,
];

// export const gotoCaseDetail = [
//   set(state`docketNumber`, props`docketNumber`),
//   actions.getCaseDetail,
//   set(state`currentPage`, 'CaseDetail'),
// ];

export const updatePetitionValue = [
  set(state`petition.${props`key`}`, props`value`),
];

export const submitFilePetition = [
  actions.setFormSubmitting,
  actions.filePdfPetition,
  actions.unsetFormSubmitting,
  actions.getFilePdfPetitionAlertSuccess,
  actions.setAlertSuccess,
  actions.navigateToDashboard,
];
