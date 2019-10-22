const {
  recallPetitionFromIRSHoldingQueueInteractor,
} = require('./recallPetitionFromIRSHoldingQueueInteractor');
const { Case } = require('../entities/cases/Case');
const { Document } = require('../entities/Document');
const { getCaseInteractor } = require('./getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
const { omit } = require('lodash');
const { User } = require('../entities/User');

const MOCK_WORK_ITEMS = [
  {
    assigneeId: null,
    assigneeName: 'IRSBatchSystem',
    caseId: 'e631d81f-a579-4de5-b8a8-b3f10ef619fd',
    caseStatus: 'Batched for IRS',
    createdAt: '2018-12-27T18:06:02.971Z',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      createdAt: '2018-12-27T18:06:02.968Z',
      documentId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      documentType: Document.INITIAL_DOCUMENT_TYPES.petition.documentType,
    },
    isInitializeCase: true,
    messages: [
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: 'Petitioner',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition batched for IRS',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: 'petitioner',
        sentBy: 'Petitioner',
        to: null,
      },
      {
        createdAt: '2018-12-27T18:06:02.968Z',
        from: 'Petitioner',
        fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        message: 'Petition ready for review',
        messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
        role: 'petitioner',
        sentBy: 'Petitioner',
        to: null,
      },
    ],
    section: 'petitions',
    sentBy: 'petitioner',
    updatedAt: '2018-12-27T18:06:02.968Z',
    workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
  },
];

describe('Recall petition from IRS Holding Queue', () => {
  let applicationContext;
  let mockCase;

  beforeEach(() => {
    mockCase = MOCK_CASE;
    mockCase.documents[0].workItems = MOCK_WORK_ITEMS;
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          name: 'Petitions Clerk',
          role: User.ROLES.petitionsClerk,
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(mockCase),
          getUserById: ({ userId }) => MOCK_USERS[userId],
          updateCase: ({ caseToUpdate }) =>
            Promise.resolve(new Case(caseToUpdate, { applicationContext })),
          updateWorkItem: async () => null,
        };
      },
      getUseCases: () => ({ getCaseInteractor }),
    };
  });

  it('throws unauthorized error if user is unauthorized', async () => {
    let error;
    applicationContext.getCurrentUser = () => {
      return new User({ role: 'petitioner', userId: 'taxpayer' });
    };

    try {
      await recallPetitionFromIRSHoldingQueueInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'someuser',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'Unauthorized for recall from IRS Holding Queue',
    );
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          role: User.ROLES.petitionsClerk,
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => null,
          getUserById: ({ userId }) => MOCK_USERS[userId],
          updateCase: () => null,
          updateWorkItem: async () => null,
        };
      },
      getUseCases: () => ({ getCaseInteractor }),
    };
    let error;
    try {
      await recallPetitionFromIRSHoldingQueueInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return new User({
          role: User.ROLES.petitionsClerk,
          userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
        });
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve(omit(mockCase, 'docketNumber')),

          getUserById: ({ userId }) => MOCK_USERS[userId],
        };
      },
      getUseCases: () => ({ getCaseInteractor }),
    };
    let error;
    try {
      await recallPetitionFromIRSHoldingQueueInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
