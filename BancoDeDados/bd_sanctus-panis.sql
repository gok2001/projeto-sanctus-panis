-- ============================================================
--  sanctusPanis
-- ============================================================

DROP DATABASE IF EXISTS sanctusPanis;
CREATE DATABASE IF NOT EXISTS sanctusPanis;
USE sanctusPanis;

-- ------------------------------------------------------------
-- usuario: cadastro dos clientes
-- ------------------------------------------------------------
CREATE TABLE usuario (
  idUsuario INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  emailUsuario VARCHAR(100) NOT NULL UNIQUE,
  cpfUsuario VARCHAR(11)  NOT NULL UNIQUE,
  senhaUsuario VARCHAR(255) NOT NULL,
  roleUsuario ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- ------------------------------------------------------------
-- endereco: um usuário pode ter vários endereços
-- ------------------------------------------------------------
CREATE TABLE endereco (
  idEndereco INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nroCasa INT,
  bairro VARCHAR(100),
  rua VARCHAR(100),
  idUsuario INT NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- produto: ingredientes/insumos do estoque
-- ------------------------------------------------------------
CREATE TABLE produto (
  idProduto INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nomeProduto VARCHAR(100) NOT NULL,
  qtdProduto FLOAT NOT NULL DEFAULT 0,
  unidadeProduto VARCHAR(10) NOT NULL  -- ex: 'g', 'un'
);

-- ------------------------------------------------------------
-- lanche: cardápio
-- ------------------------------------------------------------
CREATE TABLE lanche (
  idLanche INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  nomeLanche VARCHAR(100) NOT NULL,
  precoLanche FLOAT NOT NULL
);

-- ------------------------------------------------------------
-- ingredienteLanche: tabela de junção lanche <-> produto  (N:N)
-- ------------------------------------------------------------
CREATE TABLE ingredienteLanche (
  idIngrediente INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idLanche INT NOT NULL,
  idProduto INT NOT NULL,
  quantidade FLOAT NOT NULL,       -- quanto desse produto vai no lanche
  unidade VARCHAR(10) NOT NULL,    -- pode diferir da unidade do estoque
  FOREIGN KEY (idLanche) REFERENCES lanche  (idLanche) ON DELETE CASCADE,
  FOREIGN KEY (idProduto) REFERENCES produto (idProduto)
);

-- ------------------------------------------------------------
-- pedidoLanche: cabeçalho do pedido
-- ------------------------------------------------------------
CREATE TABLE pedidoLanche (
  idPedido INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  observacaoPedido VARCHAR(500),
  datahoraPedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  statusPedido ENUM('carrinho','em_preparo','finalizado') NOT NULL DEFAULT 'carrinho',
  idUsuario INT NOT NULL,
  FOREIGN KEY (idUsuario) REFERENCES usuario (idUsuario)
);

-- ------------------------------------------------------------
-- itemPedido: tabela de junção pedido <-> lanche  (N:N)
-- ------------------------------------------------------------
CREATE TABLE itemPedido (
  idItemPedido INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  idPedido INT NOT NULL,
  idLanche INT NOT NULL,
  quantidade INT NOT NULL DEFAULT 1,
  FOREIGN KEY (idPedido) REFERENCES pedidoLanche (idPedido) ON DELETE CASCADE,
  FOREIGN KEY (idLanche) REFERENCES lanche (idLanche)
);
