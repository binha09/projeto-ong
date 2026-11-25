-- ONG Esperança Viva · database/seed.sql
-- Projeto Integrador Extensionista II · Aula 2
-- Aluna: Debora Araujo do Rio
-- Dados de exemplo. Execute após database/schema.sql.

SET NAMES utf8mb4;
USE ong_esperanca_viva;

INSERT INTO categoria (nome, descricao) VALUES
  ('Alimento', 'Alimentos não perecíveis e cestas básicas'),
  ('Higiene', 'Itens de higiene pessoal e limpeza'),
  ('Vestuário', 'Roupas, calçados e agasalhos');

INSERT INTO item (id_categoria, nome, unidade, estoque_minimo) VALUES
  (1, 'Arroz 5 kg', 'pacote', 10),
  (1, 'Feijão 1 kg', 'pacote', 15),
  (1, 'Óleo de soja 900 ml', 'garrafa', 8),
  (1, 'Leite em pó 400 g', 'lata', 12),
  (2, 'Sabonete', 'unidade', 20),
  (2, 'Creme dental', 'unidade', 15),
  (2, 'Fralda infantil', 'pacote', 10),
  (3, 'Agasalho', 'peça', 10),
  (3, 'Cobertor', 'unidade', 8);

INSERT INTO doador (nome, email, telefone, tipo_doador) VALUES
  ('Mercado Bom Preço', 'contato@bompreco.exemplo.com', '(11) 3333-1000', 'Pessoa Jurídica'),
  ('Ana Souza', 'ana.souza@exemplo.com', '(11) 98888-1001', 'Pessoa Física'),
  ('Carlos Lima', NULL, '(11) 97777-1002', 'Pessoa Física'),
  ('Paróquia São José', 'secretaria@psaojose.exemplo.com', NULL, 'Pessoa Jurídica');

INSERT INTO doacao (id_doador, data_doacao, valor_monetario, observacao) VALUES
  (1, '2026-10-05', 0.00, 'Entrega feita pelo próprio mercado'),
  (2, '2026-10-12', 150.00, NULL),
  (4, '2026-10-18', 0.00, 'Campanha do agasalho');

INSERT INTO doacao_item (id_doacao, id_item, quantidade) VALUES
  (1, 1, 10),
  (1, 2, 15),
  (1, 3, 8),
  (2, 5, 12),
  (2, 6, 12),
  (3, 8, 20),
  (3, 9, 6);

INSERT INTO voluntario (nome, email, telefone, area_atuacao) VALUES
  ('Mariana Alves', 'mariana.alves@exemplo.com', '(11) 99111-2001', 'Triagem e Estoque'),
  ('Rafael Costa', 'rafael.costa@exemplo.com', '(11) 99222-2002', 'Distribuição');

INSERT INTO acao_social (titulo, descricao, data_evento, local_evento, vagas, status) VALUES
  ('Mutirão Cesta Solidária', 'Montagem e entrega de cestas básicas para famílias cadastradas.', '2026-12-05', 'Sede da ONG Esperança Viva', 20, 'Planejada');

INSERT INTO voluntario_acao (id_voluntario, id_acao, funcao, horas_dedicadas) VALUES
  (1, 1, 'Organização de cestas', 4.00),
  (2, 1, 'Logística de entregas', 4.00);
