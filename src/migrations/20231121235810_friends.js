/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE friends (
    idfriendship int unsigned NOT NULL AUTO_INCREMENT,
    idfriendone int unsigned DEFAULT NULL,
    idfriendtwo int unsigned DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idfriendship),
    KEY FK_idfriendone (idfriendone),
    KEY FK_idfriendtwo (idfriendtwo),
    CONSTRAINT FK_idfriendone FOREIGN KEY (idfriendone) REFERENCES users (iduser),
    CONSTRAINT FK_idfriendtwo FOREIGN KEY (idfriendtwo) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table friends`)
};
