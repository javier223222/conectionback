/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE perfildescription (
    iduser int unsigned NOT NULL,
    description varchar(300) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    update_at datetime DEFAULT NULL,
    PRIMARY KEY (iduser),
    KEY idperfildescription (iduser),
    CONSTRAINT FK_userdescription FOREIGN KEY (iduser) REFERENCES users (iduser)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table perfildescription`)
};
