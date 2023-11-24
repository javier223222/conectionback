/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE socialmedia (
    idsocialmedia int unsigned NOT NULL AUTO_INCREMENT,
    nameofsocialmedia varchar(20) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idsocialmedia),
    KEY idsocialmedia (idsocialmedia)
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.raw(`drop table socialmedia`)
};
