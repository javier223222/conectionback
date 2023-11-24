/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.raw(`CREATE TABLE dataaboutmajor (
    iduser int unsigned NOT NULL,
    idmajor int unsigned DEFAULT NULL,
    numersemster int unsigned DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) DEFAULT '0',
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (iduser),
    KEY iduser (iduser) /*!80000 INVISIBLE */,
    KEY idmajor (idmajor),
    CONSTRAINT FK_idmajordat FOREIGN KEY (idmajor) REFERENCES major (idmajor),
    CONSTRAINT FK_idusedataaboutmajor FOREIGN KEY (iduser) REFERENCES users (iduser)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table dataaboutmajor`)
};
