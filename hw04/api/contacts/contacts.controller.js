const contactsModel = require("./contacts.model");

async function listContacts(req, res, next) {
  try {
    const availableSubscriptions = ["free", "pro", "premium"];
    const { subscription } = req.query;
    if (availableSubscriptions.includes(subscription)) {
      const contacts = await contactsModel.listContacts(subscription);
      return res.json(contacts);
    }
    if (!subscription) {
      const contacts = await contactsModel.listContacts();
      return res.json(contacts);
    }
    return res.status(400).json({
      message: "Please, choose a valid subscription: free, pro, premium.",
    });
  } catch (err) {
    next(err);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await contactsModel.getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "contact not found" });
    }
    res.json(contact);
  } catch (err) {
    next(err);
  }
}

async function removeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const removedContact = await contactsModel.removeContact(contactId);
    if (!removedContact) {
      return res.status(404).json({ message: "contact not found" });
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
        .json({ message: "contact with such email or phone already exists" });
    }
    res.status(201).json(newContact);
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
      return res.status(404).json({ message: "contact not found" });
    }
    res.json(updatedContact);
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
