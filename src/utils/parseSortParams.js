import { SORT_CONTACTS } from '../constants/index.js';

const parseSortContacts = (sortContacts) => {
  const isKnownSort = [SORT_CONTACTS.ASC, SORT_CONTACTS.DESC].includes(
    sortContacts,
  );
  if (isKnownSort) return sortContacts;
  return SORT_CONTACTS.ASC;
};

const parseSortBy = (SortBy) => {
  const keysOfContacts = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
    'createdAt',
    'updatedAt',
  ];

  if (keysOfContacts.includes(SortBy)) return SortBy;
  return '_id';
};

export const parseSortParams = (query) => {
  const { sortContacts, sortBy } = query;

  const parsedSortContacts = parseSortContacts(sortContacts);
  const parsedSortBy = parseSortBy(sortBy);

  return {
    sortContacts: parsedSortContacts,
    sortBy: parsedSortBy,
  };
};
