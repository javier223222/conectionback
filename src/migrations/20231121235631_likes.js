/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE likes (
    idlike int unsigned NOT NULL AUTO_INCREMENT,
    idpublicacion int unsigned NOT NULL,
    create_at datetime DEFAULT CURRENT_TIMESTAMP,
    iduser int unsigned NOT NULL,
    deleted tinyint(1) DEFAULT '0',
    PRIMARY KEY (idlike),
    KEY idlike (idlike)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table likes`)
};
