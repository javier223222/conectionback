/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE media_comment_ofpublications (
    idcoomentofpublication int unsigned NOT NULL AUTO_INCREMENT,
    idcoment int unsigned DEFAULT NULL,
    idfile int unsigned DEFAULT NULL,
    PRIMARY KEY (idcoomentofpublication),
    KEY FK_Idcomentofp (idcoment),
    KEY FK_Idfileofcome (idfile),
    CONSTRAINT FK_Idcomentofp FOREIGN KEY (idcoment) REFERENCES coments_of_publication (idcoment),
    CONSTRAINT FK_Idfileofcome FOREIGN KEY (idfile) REFERENCES files (idfile) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3`) 
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.raw(`drop table media_comment_ofpublications`)
  
};
