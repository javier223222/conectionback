/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
  CREATE TABLE users (
    iduser int unsigned NOT NULL AUTO_INCREMENT,
    username varchar(40) NOT NULL,
    email varchar(50) DEFAULT NULL,
    name varchar(30) DEFAULT NULL,
    apellidop varchar(30) DEFAULT NULL,
    apellidom varchar(30) DEFAULT NULL,
    birthday datetime DEFAULT NULL,
    telephononumber varchar(10) DEFAULT NULL,
    password varchar(200) DEFAULT NULL,
    gender varchar(8) DEFAULT NULL,
    status varchar(20) DEFAULT NULL,
    code varchar(100) DEFAULT NULL,
    deleted tinyint(1) DEFAULT '0',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT NULL,
    deleted_at datetime DEFAULT NULL,
    PRIMARY KEY (iduser),
    UNIQUE KEY username (username) /*!80000 INVISIBLE */,
    UNIQUE KEY email_UNIQUE (email),
    KEY indemorefaster (iduser),
    KEY indc (iduser) /*!80000 INVISIBLE */,
    KEY email (email),
    KEY Fk_username (username)
  ) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb3
  `)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`drop table users`)
};
