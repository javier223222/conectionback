/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE typeofprivacidad (
    idtypeofprivacy int unsigned NOT NULL AUTO_INCREMENT,
    nameofprivacy varchar(40) NOT NULL,
    PRIMARY KEY (idtypeofprivacy),
    KEY idtypeofprivacidad (idtypeofprivacy)
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.raw(`drop table typeofprivacidad`)
};
