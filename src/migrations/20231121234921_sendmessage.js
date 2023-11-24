/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE sendmessage (
    idmessageSend int unsigned NOT NULL AUTO_INCREMENT,
    idmessage int unsigned DEFAULT NULL,
    idusersend int unsigned DEFAULT NULL,
    conentMessage varchar(200) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idmessageSend),
    KEY FK_idmessagesen (idmessage),
    KEY FK_iduusersend (idusersend),
    CONSTRAINT FK_idmessagesen FOREIGN KEY (idmessage) REFERENCES mesagge (idmessage),
    CONSTRAINT FK_iduusersend FOREIGN KEY (idusersend) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.raw(`drop table sendmessage`)
};
