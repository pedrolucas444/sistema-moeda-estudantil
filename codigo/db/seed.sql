
-- seed.sql


INSERT INTO instituicao (nome) VALUES
  ('Universidade Federal Exemplar'),
  ('Instituto Tecnológico Exemplar');


INSERT INTO empresa (nome, cnpj, ativa, email, senha_hash)
VALUES ('Cantina do Campus', '12.345.678/0001-99', TRUE, 'contato@cantina.example', 'HASH_AQUI'),
       ('Livraria do Campus', '98.765.432/0001-11', TRUE, 'contato@livraria.example', 'HASH_AQUI');

INSERT INTO usuario (email, senha_hash) VALUES
  ('aluno1@example.com', 'HASH_ALUNO'),
  ('prof1@example.com', 'HASH_PROF');


INSERT INTO aluno (id, nome, cpf, rg, endereco, instituicao_id, curso)
SELECT u.id, 'Aluno Um', '111.111.111-11', 'MG-10.000.000', 'Rua A, 123', i.id, 'Engenharia de Software'
FROM usuario u CROSS JOIN LATERAL
  (SELECT id FROM instituicao ORDER BY nome LIMIT 1) i
WHERE u.email = 'aluno1@example.com';


INSERT INTO professor (id, nome, cpf, instituicao_id)
SELECT u.id, 'Professor Um', '222.222.222-22', i.id
FROM usuario u CROSS JOIN LATERAL
  (SELECT id FROM instituicao ORDER BY nome LIMIT 1) i
WHERE u.email = 'prof1@example.com';


INSERT INTO transacao (usuario_id, valor, descricao)
SELECT p.id, 1000, 'Saldo inicial para testes'
FROM professor p
JOIN usuario u ON u.id = p.id
WHERE u.email = 'prof1@example.com';


INSERT INTO vantagem (empresa_id, titulo, descricao, custo_moedas, foto_url)
SELECT e.id, 'Desconto na Cantina', '10% de desconto em refeições', 200, 'https://example.com/cantina.png'
FROM empresa e WHERE e.nome = 'Cantina do Campus';

INSERT INTO vantagem (empresa_id, titulo, descricao, custo_moedas, foto_url)
SELECT e.id, 'Desconto Livraria', 'R$ 30 de desconto em livros', 300, 'https://example.com/livraria.png'
FROM empresa e WHERE e.nome = 'Livraria do Campus';
