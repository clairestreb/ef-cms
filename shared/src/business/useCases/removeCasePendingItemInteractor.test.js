const {
  removeCasePendingItemInteractor,
} = require('./removeCasePendingItemInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { Case } = require('../entities/cases/Case');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

describe('removeCasePendingItemInteractor', () => {
  let user;

  beforeEach(() => {
    user = new User({
      name: 'Petitions Clerk',
      role: User.ROLES.petitionsClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(MOCK_CASE);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(v => v);
  });

  it('should throw an unauthorized error if user is unauthorized for updating a case', async () => {
    user = new User({
      name: 'Petitioner',
      role: User.ROLES.petitioner,
      userId: '2c464719-646c-463e-9826-16443500ed88',
    });

    await expect(
      removeCasePendingItemInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // documents[3] from MOCK_CASE
      }),
    ).rejects.toThrow('Unauthorized for update case');
  });

  it('should call updateCase with the pending document set to pending=false', async () => {
    await removeCasePendingItemInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // documents[3] from MOCK_CASE
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[3].pending,
    ).toEqual(false);
  });

  it('should call updateCase with automaticBlocked=false if there are no deadlines or pending items remaining on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByCaseId.mockReturnValue([]);

    await removeCasePendingItemInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // documents[3] from MOCK_CASE
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: undefined,
      automaticBlockedReason: undefined,
    });
  });

  it('should call updateCase with automaticBlocked=true and a reason and call deleteCaseTrialSortMappingRecords if there are deadlines remaining on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByCaseId.mockReturnValue([{ deadline: 'something' }]);

    await removeCasePendingItemInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859', // documents[3] from MOCK_CASE
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.dueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });
});
