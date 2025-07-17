import { SORT_CONTACTS } from '../constants/index.js';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortContacts = SORT_CONTACTS.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  let contactsQuery = ContactsCollection.find();

  if (filter.name) {
    contactsQuery.where('name').regex(new RegExp(filter.name, 'i'));
  }
  if (filter.phoneNumber) {
    contactsQuery.where('phoneNumber').regex(new RegExp(filter.phoneNumber));
  }
  if (filter.email !== undefined) {
    if (filter.email === 'empty' || filter.email === 'n/a') {
      contactsQuery.where('email').in(['', null]);
    } else if (filter.email === '*') {
      contactsQuery.where('email').nin(['', null]);
    } else if (filter.email === '') {
    } else {
      contactsQuery.where('email').regex(new RegExp(filter.name, 'i'));
    }
  }
  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.contactType) {
    const types = Array.isArray(filter.contactType)
      ? filter.contactType
      : [filter.contactType];
    contactsQuery.where('contactType').in(types);
  }
  if (filter.dateFrom || filter.dateTo) {
    const dateFilter = {};

    if (filter.dateFrom) {
      const fromDate = new Date(filter.dateFrom);
      if (!isNaN(fromDate)) {
        dateFilter.$gte = fromDate;
      }
    }

    if (filter.dateTo) {
      const toDate = new Date(filter.dateTo);
      if (!isNaN(toDate)) {
        dateFilter.$lte = toDate;
      }
    }

    contactsQuery = contactsQuery.where('createdAt', dateFilter);
  }

  if (filter.updatedAt) {
    contactsQuery.where('updatedAt').equals(filter.updatedAt);
  }

  const contactCount = await ContactsCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortContacts })
    .exec();
  const paginationData = calculatePaginationData(contactCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({ _id: contactId });
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );
  if (!rawResult || !rawResult.value) return null;
  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
