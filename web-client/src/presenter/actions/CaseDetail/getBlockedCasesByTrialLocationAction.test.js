import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getBlockedCasesByTrialLocationAction } from './getBlockedCasesByTrialLocationAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

applicationContext
  .getUseCases()
  .getBlockedCasesInteractor.mockImplementation(async () => {
    return [{ blocked: true, caseId: '1', preferredTrialCity: 'Boise, Idaho' }];
  });

describe('getBlockedCasesByTrialLocationAction', () => {
  it('should not call getBlockedCasesInteractor if the trialLocation is not on the form', async () => {
    await runAction(getBlockedCasesByTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {},
      },
    });

    expect(
      applicationContext.getUseCases().getBlockedCasesInteractor,
    ).not.toHaveBeenCalled();
  });

  it('should call getBlockedCasesInteractor with the passed in trialLocation and return the result from the use case', async () => {
    const result = await runAction(getBlockedCasesByTrialLocationAction, {
      modules: {
        presenter,
      },
      state: {
        form: {
          trialLocation: 'Boise, Idaho',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getBlockedCasesInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().getBlockedCasesInteractor.mock
        .calls[0][0].trialLocation,
    ).toEqual('Boise, Idaho');
    expect(result.output).toEqual({
      blockedCases: [
        { blocked: true, caseId: '1', preferredTrialCity: 'Boise, Idaho' },
      ],
    });
  });
});
