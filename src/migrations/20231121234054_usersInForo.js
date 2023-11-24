/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE usersinforo (
    iduserinforo int unsigned NOT NULL AUTO_INCREMENT,
    idforo int unsigned NOT NULL,
    iduser int unsigned NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) DEFAULT '0',
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (iduserinforo),
    KEY FK_idforod (idforo),
    KEY FK_iduserinfor (iduser),
    KEY idusuarioinforo (iduserinforo),
    CONSTRAINT FK_idforod FOREIGN KEY (idforo) REFERENCES foro (idforo),
    CONSTRAINT FK_iduserinfor FOREIGN KEY (iduser) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.raw(`drop table usersinforo`)
};
