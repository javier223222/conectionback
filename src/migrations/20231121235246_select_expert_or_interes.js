/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE select_expert_or_interes (
    idselectexperorinterest int unsigned NOT NULL AUTO_INCREMENT,
    idineterestorexpert int unsigned DEFAULT NULL,
    iduser int unsigned DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    experot tinyint DEFAULT NULL,
    PRIMARY KEY (idselectexperorinterest),
    KEY FK_experoorInterest (idineterestorexpert),
    KEY idseectorexpert (idselectexperorinterest),
    KEY FK_iduser (iduser),
    KEY FK_expertoir (experot),
    CONSTRAINT FK_experoorInterest FOREIGN KEY (idineterestorexpert) REFERENCES expertoorinterest (idineterestorexpert),
    CONSTRAINT FK_iduserexpero FOREIGN KEY (iduser) REFERENCES users (iduser)
  ) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb3`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table select_expert_or_interes`)
};
