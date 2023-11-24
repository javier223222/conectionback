/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.raw(`CREATE TABLE usercommentforo (
    iduserintera int unsigned NOT NULL AUTO_INCREMENT,
    idforo int unsigned NOT NULL,
    iduser int unsigned NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    bodyofpublication varchar(100) DEFAULT NULL,
    PRIMARY KEY (iduserintera),
    KEY FK_idforodc (idforo),
    KEY FK_iduserinforc (iduser),
    CONSTRAINT FK_idforodc FOREIGN KEY (idforo) REFERENCES foro (idforo),
    CONSTRAINT FK_iduserinforc FOREIGN KEY (iduser) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table usercommentforo`)
};
