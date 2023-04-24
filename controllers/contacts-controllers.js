const { Contact } = require("../models/contact-schema");
const HttpError = require("../helpers/HttpError");
const { ctrlWrapper } = require("../utils");

const getAllContacts = async (req, res) => {
  const result = await Contact.find();
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = { owner };
  if (favorite === "true") {
    filter.favorite = true;
  }
  const result = await Contact.find(filter, "", { skip, limit }).populate(
    "owner",
    "email"
  );
  res.json(result);
};

@@ -17,7 +28,15 @@ const getContactById = async (req, res) => {
};

const addContact = async (req, res) => {
  const result = await Contact.create(req.body);
  const { _id: owner } = req.user;
  const { email, phone } = req.body;
  const existingContact = await Contact.findOne({
    $or: [{ email }, { phone }],
  });
if (existingContact) {
  throw HttpError(409, "Email or phone already in use");
}
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

@@ -38,8 +57,6 @@ const updateContactById = async (req, res) => {
  }
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  console.log("body", req.body);
  console.log("result", result);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};
const updateStatusContact = async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw HttpError(400);
  }
  const { contactId: id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};
module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContactById: ctrlWrapper(deleteContactById),
  updateContactById: ctrlWrapper(updateContactById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};