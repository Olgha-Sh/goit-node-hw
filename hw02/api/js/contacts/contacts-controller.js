const contactsModel = require("./contacts-model");

async function listContacts(_, res, next) {
  try {
    const contacts = await contactsModel.listContacts(next);
    res.send(JSON.parse(contacts));
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsModel.getContactById(contactId, next);
    if (!contact) {
      return res.status(404).send({ message: "contact not found" });
    }
    res.send(contact);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsModel.getContactById(contactId, next);
    if (!contact) {
      return res.status(404).send({ message: "contact not found" });
    }
    await contactsModel.removeContact(contactId, next);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = await contactsModel.addContact(req.body, next);
    res.status(201).send(newContact);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsModel.getContactById(contactId, next);
    if (!contact) {
      return res.status(404).send({ message: "contact not found" });
    }
    const updatedContact = await contactsModel.updateContact(
      contactId,
      req.body,
      next
    );
    res.send(updatedContact);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
