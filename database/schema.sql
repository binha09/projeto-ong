-- ONG Esperança Viva · database/schema.sql
-- Projeto Integrador Extensionista II · Atividade 2

SET NAMES utf8mb4;
DROP DATABASE IF EXISTS ong_esperanca_viva;
CREATE DATABASE ong_esperanca_viva
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE ong_esperanca_viva;

-- Doadores (LGPD: apenas dados necessários para contato e registro das doações)
CREATE TABLE doador (
  id_doador     INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(150) NOT NULL,
  email         VARCHAR(100) UNIQUE,
  telefone      VARCHAR(20),
  tipo_doador   ENUM('Pessoa Física', 'Pessoa Jurídica') NOT NULL DEFAULT 'Pessoa Física',
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Categorias de itens doados
CREATE TABLE categoria (
  id_categoria INT AUTO_INCREMENT PRIMARY KEY,
  nome         VARCHAR(80) NOT NULL UNIQUE,
  descricao    VARCHAR(255)
);

-- Itens recebidos ou gerenciados pela ONG
CREATE TABLE item (
  id_item        INT AUTO_INCREMENT PRIMARY KEY,
  id_categoria   INT NOT NULL,
  nome           VARCHAR(120) NOT NULL,
  unidade_medida VARCHAR(20) NOT NULL DEFAULT 'un',
  estoque_minimo INT NOT NULL DEFAULT 0 CHECK (estoque_minimo >= 0),
  UNIQUE (id_categoria, nome),
  FOREIGN KEY (id_categoria) REFERENCES categoria (id_categoria)
);

-- Registro de doações (itens e/ou contribuição financeira)
CREATE TABLE doacao (
  id_doacao       INT AUTO_INCREMENT PRIMARY KEY,
  id_doador       INT NOT NULL,
  data_doacao     DATE NOT NULL,
  valor_monetario DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (valor_monetario >= 0),
  observacoes     VARCHAR(255),
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_doador) REFERENCES doador (id_doador)
);

-- Tabela associativa N:N entre doação e item
CREATE TABLE doacao_item (
  id_doacao  INT NOT NULL,
  id_item    INT NOT NULL,
  quantidade INT NOT NULL CHECK (quantidade > 0),
  PRIMARY KEY (id_doacao, id_item),
  FOREIGN KEY (id_doacao) REFERENCES doacao (id_doacao) ON DELETE CASCADE,
  FOREIGN KEY (id_item) REFERENCES item (id_item)
);

-- Voluntários da ONG (LGPD: sem CPF ou endereço residencial completo)
CREATE TABLE voluntario (
  id_voluntario INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(150) NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  telefone      VARCHAR(20),
  area_atuacao  VARCHAR(100) NOT NULL,
  ativo         BOOLEAN NOT NULL DEFAULT TRUE,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ações sociais e campanhas promovidas pela ONG
CREATE TABLE acao_social (
  id_acao      INT AUTO_INCREMENT PRIMARY KEY,
  titulo       VARCHAR(150) NOT NULL,
  descricao    VARCHAR(500) NOT NULL,
  data_evento  DATE NOT NULL,
  local_evento VARCHAR(150) NOT NULL,
  vagas        INT NOT NULL CHECK (vagas > 0),
  status       ENUM('Planejada', 'Em andamento', 'Concluída', 'Cancelada') NOT NULL DEFAULT 'Planejada'
);

-- Tabela associativa N:N entre voluntário e ação social
CREATE TABLE voluntario_acao (
  id_voluntario   INT NOT NULL,
  id_acao         INT NOT NULL,
  funcao          VARCHAR(80) NOT NULL DEFAULT 'Apoio geral',
  horas_dedicadas DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (horas_dedicadas >= 0),
  data_inscricao  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_voluntario, id_acao),
  FOREIGN KEY (id_voluntario) REFERENCES voluntario (id_voluntario) ON DELETE CASCADE,
  FOREIGN KEY (id_acao) REFERENCES acao_social (id_acao) ON DELETE CASCADE
);
