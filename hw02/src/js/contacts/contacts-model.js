const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(__dirname, "../../db/contacts.json");
const textFormat = "utf-8";

function listContacts() {
  return fsPromises.readFile(contactsPath, textFormat);
}

async function getContactById(contactId) {
  const contacts = await fsPromises.readFile(contactsPath, textFormat);
  return JSON.parse(contacts).find(
    (contact) => contact.id === Number(contactId)
  );
}

async function removeContact(contactId) {
  const contacts = await fsPromises.readFile(contactsPath, textFormat);
  const newContacts = JSON.parse(contacts).filter(
    (contact) => contact.id !== Number(contactId)
  );
  await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
  return true;
}

async function addContact({ name, email, phone }) {
  const newContact = { id: uuidv4(), name, email, phone };
  const data = await fsPromises.readFile(contactsPath, textFormat);
  const contacts = JSON.parse(data);
  contacts.push(newContact);
  await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
}

async function updateContact(contactId, propsToUpdate) {
  const contacts = await fsPromises.readFile(contactsPath, textFormat);
  let contactToUpdate = JSON.parse(contacts).find(
    (contact) => contact.id === Number(contactId)
  );
  contactToUpdate = { ...contactToUpdate, ...propsToUpdate };
  const newContacts = JSON.parse(contacts).filter(
    (contact) => contact.id !== Number(contactId)
  );
  newContacts.push(contactToUpdate);
  await fsPromises.writeFile(contactsPath, JSON.stringify(newContacts));
  return contactToUpdate;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
