const Joi = require("joi");
const { Router } = require("express");
const { validate } = require("../helpers/validate");
const contactsController = require("./contacts-controller");

const router = Router();

const createContactScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
});

const updateContactScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
}).min(1);

router.post("/", validate(createContactScheme), contactsController.addContact);
router.get("/", contactsController.listContacts);
router.get("/:contactId", contactsController.getContactById);
router.patch(
  "/:contactId",
  validate(updateContactScheme),
  contactsController.updateContact
);
router.delete("/:contactId", contactsController.removeContact);

exports.contactsRouter = router;
