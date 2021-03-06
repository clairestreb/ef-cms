import { state } from 'cerebral';
import { uniq } from 'lodash';

export const publicAlertHelper = get => {
  const alertError = get(state.alertError) || {};

  return {
    messagesDeduped: uniq(alertError.messages),
    showErrorAlert:
      !!alertError.title || !!alertError.message || !!alertError.messages,
    showTitleOnly:
      !!alertError.title && !alertError.message && !alertError.messages,
  };
};
