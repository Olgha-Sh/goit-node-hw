const contactsModel = require("./contacts-model");

async function listContacts(_, res, next) {
  try {
    const contacts = await contactsModel.listContacts();
    res.send(contacts);
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsModel.getContactById(contactId);
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
    const removedContact = await contactsModel.removeContact(contactId);
    if (!removedContact) {
      return res.status(404).send({ message: "contact not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function addContact(req, res, next) {
  try {
    const newContact = await contactsModel.addContact(req.body);
    if (!newContact) {
      return res
        .status(409)
        .send({ message: "contact with such email or phone already exists" });
    }
    res.status(201).send(newContact);
  } catch (err) {
    next(err);
  }
}

async function updateContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const updatedContact = await contactsModel.updateContact(
      contactId,
      req.body
    );
    if (!updatedContact) {
      return res.status(404).send({ message: "contact not found" });
    }
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
