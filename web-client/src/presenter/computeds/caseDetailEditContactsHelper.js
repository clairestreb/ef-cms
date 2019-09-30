import { state } from 'cerebral';

export const getOptionsForContact = ({ PARTY_TYPES, partyType }) => {
  let contacts;
  switch (partyType) {
    case PARTY_TYPES.conservator:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Conservator Information',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of conservator',
        },
      };
      break;
    case PARTY_TYPES.corporation:
      contacts = {
        contactPrimary: {
          displayInCareOf: true,
          header: 'Corporation Information',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'Your Name',
          nameLabel: 'Business name',
        },
      };
      break;
    case PARTY_TYPES.custodian:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Custodian Information',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of Custodian',
        },
      };
      break;
    case PARTY_TYPES.donor:
      contacts = {
        contactPrimary: {
          header: 'Donor Information',
          nameLabel: 'Name of petitioner',
        },
      };
      break;
    case PARTY_TYPES.estate:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          displayTitle: true,
          header: 'Executor/Personal Representative/Etc.',
          nameLabel: 'Name of Decedent',
          secondaryNameLabel: 'Name of Executor/Personal Representative, etc.',
          titleHint: 'optional',
        },
      };
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      contacts = {
        contactPrimary: {
          displayInCareOf: true,
          header: 'Estate Information',
          inCareOfLabel: 'In care of',
          inCareOfLabelHint: 'optional',
          nameLabel: 'Name of Decedent',
        },
      };
      break;
    case PARTY_TYPES.guardian:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Guardian Information',
          nameLabel: 'Name of taxpayer',
          secondaryNameLabel: 'Name of Guardian',
        },
      };
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Next Friend Information',
          nameLabel: 'Name of Legally Incompetent Person',
          secondaryNameLabel: 'Name of Next Friend',
        },
      };
      break;
    case PARTY_TYPES.nextFriendForMinor:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Next Friend Information',
          nameLabel: 'Name of Minor',
          secondaryNameLabel: 'Name of Next Friend',
        },
      };
      break;
    case PARTY_TYPES.partnershipBBA:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Partnership Representative',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of Partnership Representative',
        },
      };
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Partnership (Other than Tax Matters Partner) Information',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of partner (other than TMP)',
        },
      };
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Tax Matters Partner Information',
          nameLabel: 'Business name',
          secondaryNameLabel: 'Name of Tax Matters Partner',
        },
      };
      break;
    case PARTY_TYPES.petitioner:
      contacts = {
        contactPrimary: {
          header: 'Petitioner Information',
          nameLabel: 'Name',
        },
      };
      break;
    case PARTY_TYPES.petitionerSpouse:
      contacts = {
        contactPrimary: {
          displayPhone: true,
          header: 'Petitioner Information',
          nameLabel: 'Name',
        },
        contactSecondary: {
          displayPhone: true,
          header: 'Spouse Information',
          nameLabel: "Spouse's name",
        },
      };
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      contacts = {
        contactPrimary: {
          header: 'Petitioner Information',
          nameLabel: 'Name of petitioner/surviving spouse',
        },
        contactSecondary: {
          displayInCareOf: true,
          displayPhone: true,
          header: 'Deceased Spouse Information',
          inCareOfLabel: 'In care of',
          nameLabel: 'Name of deceased spouse',
        },
      };
      break;
    case PARTY_TYPES.survivingSpouse:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Petitioner Information',
          nameLabel: 'Name of deceased spouse',
          secondaryNameLabel: 'Name of Surviving Spouse',
        },
      };
      break;
    case PARTY_TYPES.transferee:
      contacts = {
        contactPrimary: {
          header: 'Transferee Information',
          nameLabel: 'Name of petitioner',
        },
      };
      break;
    case PARTY_TYPES.trust:
      contacts = {
        contactPrimary: {
          displaySecondaryName: true,
          header: 'Trustee Information',
          nameLabel: 'Name of Trust',
          secondaryNameLabel: 'Name of Trustee',
        },
      };
      break;
  }

  ['contactPrimary', 'contactSecondary'].forEach(contactLabel => {
    if (contacts[contactLabel]) {
      contacts[contactLabel].phoneNumberLabelHint = 'optional';
    }
  });

  return contacts;
};

/**
 * gets the contact view options based on partyType
 *
 * @param {Function} get the cerebral get function used
 * for getting state.caseDetail.partyType and state.constants
 * @returns {object} the contactPrimary and/or contactSecondary
 * view options
 */
export const caseDetailEditContactsHelper = get => {
  const partyType = get(state.caseDetail.partyType);
  const { PARTY_TYPES } = get(state.constants);

  const contacts = getOptionsForContact({ PARTY_TYPES, partyType });

  return contacts;
};
