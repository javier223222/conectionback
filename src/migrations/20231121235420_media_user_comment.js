/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.raw(`
   CREATE TABLE media_user_comment (
    idmediac int unsigned NOT NULL AUTO_INCREMENT,
    iduserintera int unsigned NOT NULL,
    idfile int unsigned NOT NULL,
    crated_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idmediac),
    KEY FK_iduseinterad (iduserintera),
    KEY FK_idfilen (idfile),
    KEY idmediac (idmediac),
    CONSTRAINT FK_idfilen FOREIGN KEY (idfile) REFERENCES files (idfile),
    CONSTRAINT FK_iduseinterad FOREIGN KEY (iduserintera) REFERENCES usercommentforo (iduserintera)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table media_user_comment`)
};
