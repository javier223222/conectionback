/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.raw(`
   CREATE TABLE expertoorinterest (
    idineterestorexpert int unsigned NOT NULL AUTO_INCREMENT,
    namefininteorexpert varchar(50) DEFAULT NULL,
    description varchar(50) DEFAULT NULL,
    idmajor int unsigned DEFAULT NULL,
    craete_at datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (idineterestorexpert),
    KEY FK_majorexperoordescription (idmajor),
    KEY idinteresorexpert (idineterestorexpert),
    CONSTRAINT FK_majorexperoordescription FOREIGN KEY (idmajor) REFERENCES major (idmajor)
  ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table expertoorinterest`)
};
