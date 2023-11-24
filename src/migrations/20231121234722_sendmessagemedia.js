/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE sendmessagemedia (
    idsendMessageMedia int unsigned NOT NULL AUTO_INCREMENT,
    idmessageSend int unsigned DEFAULT NULL,
    idfile int unsigned DEFAULT NULL,
    PRIMARY KEY (idsendMessageMedia),
    KEY FK_idinteractionmen (idmessageSend),
    KEY FK_idfileMensagge (idfile),
    CONSTRAINT FK_idfileMensagge FOREIGN KEY (idfile) REFERENCES files (idfile),
    CONSTRAINT FK_idinteractionmen FOREIGN KEY (idmessageSend) REFERENCES sendmessage (idmessageSend)
  ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table sendmessagemedia`)
};
