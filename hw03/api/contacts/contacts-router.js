const Joi = require("joi");
const { Router } = require("express");
const {
  Types: { ObjectId },
} = require("mongoose");
const { validate } = require("../helpers/validate");
const contactsController = require("./contacts-controller");

const router = Router();

const createContactScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
});

const updateContactScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string(),
}).min(1);

const contactIdSchema = Joi.object({
  userId: Joi.string()
    .custom((value, helpers) => {
      const isValidObjectId = ObjectId.isValid(value);
      if (!isValidObjectId) {
        return helpers.error("Invalid user id. Must be object id");
      }
      return value;
    })
    .required(),
});

router.post("/", validate(createContactScheme), contactsController.addContact);
router.get("/", contactsController.listContacts);
router.get(
  "/:contactId",
  validate(contactIdSchema, "params"),
  contactsController.getContactById
);
router.patch(
  "/:contactId",
  validate(updateContactScheme),
  validate(contactIdSchema, "params"),
  contactsController.updateContact
);
router.delete(
  "/:contactId",
  validate(contactIdSchema, "params"),
  contactsController.removeContact
);

exports.contactsRouter = router;
