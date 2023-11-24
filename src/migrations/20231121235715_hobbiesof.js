/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE hobbiesof (
    idhobbiesof int unsigned NOT NULL AUTO_INCREMENT,
    idhobbie int unsigned NOT NULL,
    iduser int unsigned NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idhobbiesof),
    KEY FK_idhobbieof (idhobbie),
    KEY FK_idusern (iduser),
    KEY FK_idhobbiesof (idhobbiesof),
    CONSTRAINT FK_idhobbieof FOREIGN KEY (idhobbie) REFERENCES hobbies (idhobbie),
    CONSTRAINT FK_iduser FOREIGN KEY (iduser) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table hobbiesof`)
};
