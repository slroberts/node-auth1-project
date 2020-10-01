exports.seed = function (knex) {
  // Inserts seed entries
  return knex('users').insert([
    { id: 1, username: 'username', password: 'password' },
  ]);
};
