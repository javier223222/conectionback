/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.raw(`CREATE TABLE foro (
        idforo int unsigned NOT NULL AUTO_INCREMENT,
        idmajor int unsigned NOT NULL,
        nameforo varchar(30) NOT NULL,
        forodescription varchar(100) NOT NULL,
        created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        imageofForo varchar(200) NOT NULL,
        PRIMARY KEY (idforo),
        KEY FK_majorfor (idmajor),
        KEY idforo (idforo),
        CONSTRAINT FK_majorfor FOREIGN KEY (idmajor) REFERENCES major(idmajor)
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.raw(`drop table foro`)
};
