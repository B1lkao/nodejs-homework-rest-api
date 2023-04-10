const fs = require('fs/promises');
const path = require('path');
const contactPath = path.join(__dirname, 'contacts.json');
const { nanoid } = require('nanoid');

const listContacts = async () => {
  const cotactList = await fs.readFile(contactPath)
    return JSON.parse(cotactList);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
    const findItem = contacts.find(item => item.id === contactId);
    return findItem||null;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
    const requiredIdx = contacts.findIndex(item => item.id === contactId);
    if (requiredIdx === -1) {return null };
    const [removedElement] = contacts.splice(requiredIdx, 1);
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
      return removedElement
}

const addContact = async ({ name, email, phone } ) => {
  const contacts = await listContacts();
    const newContact = {
        id: nanoid(3),
        name,
        email,
        phone
    };
    contacts.push(newContact)
    await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
    return newContact;
}

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const requiredIdx = contacts.findIndex(item => item.id === contactId);
  if (requiredIdx === -1) { return null };
  contacts[requiredIdx] = {...contacts[requiredIdx],...body }
  await fs.writeFile(contactPath, JSON.stringify(contacts, null, 2));
  return contacts[requiredIdx];

}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
