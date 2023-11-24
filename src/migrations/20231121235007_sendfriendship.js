/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE sendfriendship (
    idsendFriendShip int unsigned NOT NULL AUTO_INCREMENT,
    idSender int unsigned NOT NULL,
    idrecives int unsigned NOT NULL,
    create_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idsendFriendShip),
    KEY FK_sender (idSender),
    KEY FK_recives (idrecives),
    CONSTRAINT FK_recives FOREIGN KEY (idrecives) REFERENCES users (iduser),
    CONSTRAINT FK_sender FOREIGN KEY (idSender) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table sendfriendship`) 
};
