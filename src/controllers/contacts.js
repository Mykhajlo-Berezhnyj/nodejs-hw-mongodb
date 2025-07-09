import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';
import { renderContact } from '../utils/renderContact.js';
import { renderContactsList } from '../utils/renderContactsList.js';

export const getContactsController = async (req, res) => {
  const contacts = await getAllContacts();
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    res.send(renderContactsList(contacts));
  } else {
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  }
};

export const getContactsByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactsById(contactId);
  const accept = req.headers.accept || '';
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  if (accept.includes('text/html')) {
    res.send(renderContact(contact));
  } else {
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  }
};

export const createContactController = async (req, res) => {
  const student = await createContact(req.body);
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    return res.send('Successfully created a contac twith id ${contactId}!');
  }
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: student,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  const accept = req.headers.accept || '';

  if (accept.includes('text/html')) {
    res.send('Contact deleted');
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body, { upcert: true });
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const status = result.isNew ? 201 : 200;
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    status === 201
      ? res.send('Successfully created new contact with id ${contactId}!')
      : res.send('Successfully updated a cotact with id ${contactId}!');
    return;
  }
  res.status(status).json({
    status: status,
    message: 'Successfully update a contact!',
    data: result.contact,
  });
};

export const pathContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  const accept = req.headers.accept || '';
  if (accept.includes('text/html')) {
    return res.send('Successfully patched a contact with id ${contactId}!');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.contact,
  });
};
