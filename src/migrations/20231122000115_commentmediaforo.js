/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE commentmediaforo (
    idcommentMediaForo int unsigned NOT NULL AUTO_INCREMENT,
    iduserintera int unsigned DEFAULT NULL,
    idfile int unsigned DEFAULT NULL,
    PRIMARY KEY (idcommentMediaForo),
    KEY FK_iduserintera (iduserintera),
    KEY FK_idfilecome (idfile),
    CONSTRAINT FK_idfilecome FOREIGN KEY (idfile) REFERENCES files (idfile),
    CONSTRAINT FK_iduserintera FOREIGN KEY (iduserintera) REFERENCES usercommentforo (iduserintera)
  ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`drop table commentmediaforo`)
};
