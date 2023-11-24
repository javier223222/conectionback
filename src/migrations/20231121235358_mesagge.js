/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE mesagge (
    idmessage int unsigned NOT NULL AUTO_INCREMENT,
    iduserone int unsigned DEFAULT NULL,
    idusertwo int unsigned DEFAULT NULL,
    deleted tinyint(1) DEFAULT '0',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    update_at datetime DEFAULT NULL,
    PRIMARY KEY (idmessage),
    KEY FK_iduserones (iduserone),
    KEY FK_iduserstwo (idusertwo) /*!80000 INVISIBLE */,
    CONSTRAINT FK_iduserones FOREIGN KEY (iduserone) REFERENCES users(iduser),
    CONSTRAINT FK_iduserstwo FOREIGN KEY (idusertwo) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table mesagge`)
};
