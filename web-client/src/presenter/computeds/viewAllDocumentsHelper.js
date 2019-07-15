import {
  getDocumentTypesForSelect,
  getSortFunction,
} from './internalTypesHelper';
import { state } from 'cerebral';

export const viewAllDocumentsHelper = get => {
  const { CATEGORIES, CATEGORY_MAP } = get(state.constants);
  const searchText = get(state.screenMetadata.searchText) || '';

  const documentTypesForSelect = getDocumentTypesForSelect(CATEGORY_MAP);

  const documentTypesForSelectSorted = documentTypesForSelect.sort(
    getSortFunction(searchText),
  );

  const sections = [...CATEGORIES];
  sections.push(sections.shift());

  const forSecondary = get(state.modal.forSecondary);
  let categoryMap = { ...CATEGORY_MAP };
  sections.forEach(section => {
    categoryMap[section] = categoryMap[section].filter(
      entry => !forSecondary || entry.scenario !== 'Nonstandard H',
    );
  });

  const reasons = [
    {
      categories: [
        {
          category: 'Application',
        },
        {
          category: 'Motion',
        },
        {
          category: 'Petition',
        },
      ],
      reason: 'Request Something From the Court',
    },
    {
      categories: [
        {
          category: 'Brief',
        },
        {
          category: 'Memorandum',
        },
        {
          category: 'Notice',
        },
        {
          category: 'Statement',
        },
        {
          category: 'Stipulation',
        },
      ],
      reason: 'Notify the Court of a Change',
    },
    {
      categories: [
        {
          category: 'Miscellaneous',
        },
        {
          category: 'Supporting Documents',
        },
      ],
      reason: 'Update or Add to a Document',
    },
    {
      categories: [
        {
          category: 'Motion',
        },
        {
          category: 'Reply',
        },
        {
          category: 'Response',
        },
      ],
      reason: 'Respond to a Previous Document',
    },
  ];
  return {
    categoryMap,
    documentTypesForSelect,
    documentTypesForSelectSorted,
    sections,
    reasons,
  };
};
