
-- functions_triggers.sql
-- Funções e gatilhos de regra de negócio

-- Atualiza saldo do usuário a cada transação inserida
CREATE OR REPLACE FUNCTION fn_atualiza_saldo() RETURNS trigger AS $$
BEGIN
  UPDATE usuario SET saldo = saldo + NEW.valor WHERE id = NEW.usuario_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_transacao_ins ON transacao;
CREATE TRIGGER tg_transacao_ins
AFTER INSERT ON transacao
FOR EACH ROW
EXECUTE FUNCTION fn_atualiza_saldo();


-- Impede saldo negativo para operações de débito
CREATE OR REPLACE FUNCTION fn_impede_saldo_negativo() RETURNS trigger AS $$
DECLARE
  saldo_atual INTEGER;
BEGIN
  SELECT saldo INTO saldo_atual FROM usuario WHERE id = NEW.usuario_id FOR UPDATE;
  IF (saldo_atual + NEW.valor) < 0 THEN
    RAISE EXCEPTION 'Saldo insuficiente para efetuar a operação (saldo %, valor %)', saldo_atual, NEW.valor;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_transacao_before_ins ON transacao;
CREATE TRIGGER tg_transacao_before_ins
BEFORE INSERT ON transacao
FOR EACH ROW
EXECUTE FUNCTION fn_impede_saldo_negativo();


-- Gera código de cupom amigável
CREATE OR REPLACE FUNCTION fn_codigo_resgate() RETURNS TEXT AS $$
DECLARE
  c TEXT;
BEGIN
  c := encode(gen_random_bytes(6), 'hex');
  RETURN upper(substr(c,1,4) || '-' || substr(c,5,4) || '-' || substr(c,9,4));
END;
$$ LANGUAGE plpgsql;

-- Ao inserir um resgate, debita as moedas do aluno e gera código automaticamente, se não informado
CREATE OR REPLACE FUNCTION fn_resgate_debita() RETURNS trigger AS $$
DECLARE
  custo INTEGER;
  usuario_aluno UUID;
BEGIN
  SELECT custo_moedas INTO custo FROM vantagem WHERE id = NEW.vantagem_id;
  IF NEW.codigo IS NULL OR NEW.codigo = '' THEN
    NEW.codigo := fn_codigo_resgate();
  END IF;

  -- aluno.id == usuario.id (subtipo)
  usuario_aluno := NEW.aluno_id;

  -- insere transação de débito (valor negativo)
  INSERT INTO transacao (usuario_id, valor, descricao)
  VALUES (usuario_aluno, -custo, CONCAT('Resgate de vantagem ', NEW.vantagem_id));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tg_resgate_before_ins ON resgate;
CREATE TRIGGER tg_resgate_before_ins
BEFORE INSERT ON resgate
FOR EACH ROW
EXECUTE FUNCTION fn_resgate_debita();


-- Crédíto semestral para professores (1000 moedas por semestre), sem tabela de cota
-- Esta função pode ser chamada manualmente no início de cada semestre ou por job externo.
CREATE OR REPLACE FUNCTION fn_credito_semestral_professores(_ano INT, _semestre INT) RETURNS VOID AS $$
DECLARE
  r RECORD;
  desc TEXT := CONCAT('Crédito semestral ', _ano, '/', _semestre);
BEGIN
  FOR r IN
    SELECT p.id AS usuario_id FROM professor p
  LOOP
    INSERT INTO transacao (usuario_id, valor, descricao)
    VALUES (r.usuario_id, 1000, desc);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

