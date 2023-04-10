const express = require('express');

const Joi = require('joi');

const router = express.Router();

const contacts = require('../../models/contacts');

const { HttpError } = require('../../helpers');

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
const putSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  phone: Joi.string().optional(),
});

router.get('/', async (req, res, next) => {
  try {
      const contactList = await contacts.listContacts();
      res.json( contactList )
  } catch (error) {
    next(error)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const searchedContact = await contacts.getContactById(contactId);
    if (!searchedContact) {
      throw HttpError(404,'Not Found')
    }
    res.json(searchedContact)
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
     throw HttpError(400, "missing required name field")
   }
    const addedContact = await contacts.addContact(req.body);
    res.status(201).json(addedContact)
    
  } catch (error) {
  next(error)
  }

  
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await contacts.removeContact(contactId)
    if (!deletedContact) {
      throw HttpError(404,'Not Found')
    }
    res.json({ "message": "contact deleted"})
  } catch (error) {
    next(error)
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
     

    const { error } = putSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message)
    } else if ((Object.keys(req.body).length < 1)) {
      throw HttpError(400, "missing fields")
    }
     const { contactId } = req.params;
    const result= await contacts.updateContact(contactId,req.body)
    if (!result) {
      throw HttpError(404, "Not Found")
    }
    res.json(result);
  } catch (error) {
    next(error)
  }
})

module.exports = router