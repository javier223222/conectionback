/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE major (
     idmajor int unsigned NOT NULL AUTO_INCREMENT,
     namemajor varchar(70) NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) DEFAULT '0',
    update_at datetime DEFAULT NULL,
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (idmajor),
    KEY idmajor (idmajor)
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.raw(`drop table major`)
};
