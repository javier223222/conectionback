/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE hobbies (
    idhobbie int unsigned NOT NULL AUTO_INCREMENT,
    namehobbie varchar(60) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL,
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (idhobbie),
    KEY idhobbie (idhobbie)
  ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`drop table hobbies`)
};
