import { clearSecondaryDocumentScenarioAction } from '../actions/FileDocument/clearSecondaryDocumentScenarioAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const editSelectedSecondaryDocumentSequence = [
  set(state.screenMetadata.isSecondaryDocumentTypeSelected, false),
  clearSecondaryDocumentScenarioAction,
];
