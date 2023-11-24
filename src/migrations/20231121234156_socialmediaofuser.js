/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.raw(`CREATE TABLE socialmediofuse (
    idsocialmediofuser int unsigned NOT NULL AUTO_INCREMENT,
    idsocialmedia int NOT NULL,
    iduser int NOT NULL,
    usrlsocialmedia varchar(130) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    deleted tinyint(1) DEFAULT '0',
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (idsocialmediofuser),
    KEY Fk_idsocialmediaofuser (idsocialmedia),
    KEY idsocialmediforuser (idsocialmediofuser),
    KEY Fk_iduser (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table socialmediofuse`)
};
