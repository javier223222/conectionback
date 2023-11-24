/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE publicaciones (
    idpublicacion int unsigned NOT NULL AUTO_INCREMENT,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    iduser int unsigned NOT NULL,
    cuerpodelapublicacion varchar(200) NOT NULL,
    idcategoria int unsigned NOT NULL,
    idtypeofprivacy int unsigned NOT NULL,
    deleted tinyint(1) DEFAULT '0',
    deleted_at datetime DEFAULT NULL,
    updated_at datetime DEFAULT NULL,
    tipoDecategoria varchar(30) DEFAULT NULL,
    typeofPulicacion int unsigned DEFAULT NULL,
    PRIMARY KEY (idpublicacion),
    KEY FK_iduserpublication (iduser),
    KEY FK_idtypeofprivacity (idtypeofprivacy),
    KEY FK_idcategoria (idcategoria),
    KEY idpublicacion (idpublicacion),
    KEY FK_typeoFcategory_idx (typeofPulicacion),
    CONSTRAINT FK_idcategoria FOREIGN KEY (idcategoria) REFERENCES categoria (idcategori),
    CONSTRAINT FK_idtypeofprivacity FOREIGN KEY (idtypeofprivacy) REFERENCES typeofprivacidad (idtypeofprivacy),
    CONSTRAINT FK_iduserpublication FOREIGN KEY (iduse) REFERENCES users (iduser),
    CONSTRAINT FK_typeoFcategory FOREIGN KEY (typeofPulicacion) REFERENCES expertoorinterest (idineterestorexpert)
  ) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table publicaciones`)
};
