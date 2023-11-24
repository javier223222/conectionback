/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE users_media (
    idmediauser int unsigned NOT NULL AUTO_INCREMENT,
    iduser int unsigned NOT NULL,
    idfile int unsigned NOT NULL,
    typeofimage varchar(40) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) DEFAULT '0',
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (idmediauser),
    KEY FK_iduserformed (iduser),
    KEY FK_idfile (idfile),
    KEY idmediauser (idmediauser),
    CONSTRAINT FK_idfile FOREIGN KEY (idfile) REFERENCES files (idfile),
    CONSTRAINT FK_iduserformed FOREIGN KEY (iduser) REFERENCES users (iduser) 
  ) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table users_media`)
};
