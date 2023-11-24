/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE image_of_publication (
    idImageOfPublication int unsigned NOT NULL AUTO_INCREMENT,
    idmediauser int unsigned NOT NULL,
    idpublicacion int unsigned NOT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idImageOfPublication),
    KEY FK_idmediauserpu (idmediauser),
    KEY FK_idpublicacionim (idpublicacion),
    KEY image_of_publication (idImageOfPublication),
    CONSTRAINT FK_idmediauserpu FOREIGN KEY (idmediauser) REFERENCES users_media (idmediauser),
    CONSTRAINT FK_idpublicacionim FOREIGN KEY (idpublicacion) REFERENCES publicaciones (idpublicacion)
  ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table image_of_publication`)
};
