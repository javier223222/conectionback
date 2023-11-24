/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.raw(`
   CREATE TABLE files (
    idfile int unsigned NOT NULL AUTO_INCREMENT,
    urlfile varchar(200) DEFAULT NULL,
    publicid varchar(200) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) DEFAULT '0',
    deleted_atdatetime DEFAULT NULL,
    PRIMARY KEY (idfile),
    KEY idfile (idfile) /*!80000 INVISIBLE */,
    KEY filename (urlfile)
  ) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb3
   `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table files`)
};
