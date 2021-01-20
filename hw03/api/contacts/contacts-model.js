const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
});

const ContactModel = mongoose.model("Contact", contactSchema);

function listContacts() {
  return ContactModel.find();
}

function getContactById(contactId) {
  return ContactModel.findById(contactId);
}

function removeContact(contactId) {
  return ContactModel.findByIdAndDelete(contactId);
}

async function addContact({ name, email, phone }) {
  const existingContact = await ContactModel.findOne({
    $or: [{ phone }, { email }],
  });
  if (existingContact) {
    return false;
  }
  return ContactModel.create(...arguments);
}

async function updateContact(contactId, propsToUpdate) {
  const updatedUser = await ContactModel.findByIdAndUpdate(
    contactId,
    propsToUpdate,
    {
      new: true,
    }
  );
  if (!updatedUser) {
    return false;
  }
  return updatedUser;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
