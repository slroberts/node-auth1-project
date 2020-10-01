const db = require('../data/connection.js');

module.exports = {
  add,
  find,
  findBy,
  findById,
};

async function add(user) {
  try {
    const [id] = await db('users').insert(user, 'id');

    return findById(id);
  } catch (error) {
    throw error;
  }
}

function find() {
  return db('users').orderBy('id');
}

function findBy(filter) {
  return db('users').where(filter).orderBy('id');
}

function findById(id) {
  return db('users').where({ id }).first();
}
