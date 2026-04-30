drop database if exists sanctusPanis;
create database if not exists sanctusPanis;
use sanctusPanis;
CREATE TABLE usuario (
  idUsuario int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nomrUsuario varchar(100),
  cpfUsuario varchar(11),
  senhaUsuario varchar(100)
);

CREATE TABLE endereco (
  idEndereco int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nroCasa int,
  bairro varchar(100),
  rua varchar(100),
  idUsuario int
);

CREATE TABLE lanche (
  idLanche int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nomeLanche varchar(100),
  precoLanche float,
  ingredientes json
);

CREATE TABLE produto (
  idProduto int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nomeProduto varchar(100),
  qtdProduto float,
  unidadeProduto varchar(10)
);

CREATE TABLE pedidoLanche (
  idPedido int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  obsevacaoPedido varchar(500),
  datahoraPedido timestamp,
  qtdLanche JSON,
  idUsuario int
);

ALTER TABLE pedidoLanche ADD FOREIGN KEY (qtdLanche) REFERENCES lanche (idLanche);

ALTER TABLE endereco ADD FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario);

ALTER TABLE lanche ADD FOREIGN KEY (ingredientes) REFERENCES produto (idProduto);

ALTER TABLE pedidoLanche ADD FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario);
