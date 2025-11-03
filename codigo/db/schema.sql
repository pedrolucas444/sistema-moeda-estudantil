
-- schema.sql
-- Banco: PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============== TABELAS ===============

CREATE TABLE instituicao (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome         VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE usuario (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        VARCHAR(180) NOT NULL UNIQUE,
  senha_hash   VARCHAR(255) NOT NULL,
  ativo        BOOLEAN NOT NULL DEFAULT TRUE,
  saldo        INTEGER NOT NULL DEFAULT 0,
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE aluno (
  id                 UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
  nome               VARCHAR(120) NOT NULL,
  cpf                VARCHAR(14)  NOT NULL UNIQUE,
  rg                 VARCHAR(20)  NOT NULL,
  endereco           TEXT         NOT NULL,
  instituicao_id     UUID         NOT NULL REFERENCES instituicao(id),
  curso              VARCHAR(120) NOT NULL
);

CREATE TABLE professor (
  id               UUID PRIMARY KEY REFERENCES usuario(id) ON DELETE CASCADE,
  nome             VARCHAR(120) NOT NULL,
  cpf              VARCHAR(14)  NOT NULL UNIQUE,
  instituicao_id   UUID         NOT NULL REFERENCES instituicao(id)
);

CREATE TABLE empresa (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome         VARCHAR(120) NOT NULL,
  cnpj         VARCHAR(18)  NOT NULL UNIQUE,
  ativa        BOOLEAN NOT NULL DEFAULT TRUE,
  email        VARCHAR(180) NOT NULL UNIQUE,
  senha_hash   VARCHAR(255) NOT NULL,
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE vantagem (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  empresa_id    UUID NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
  titulo        VARCHAR(120) NOT NULL,
  descricao     TEXT,
  custo_moedas  INTEGER NOT NULL CHECK (custo_moedas > 0),
  foto_url      TEXT,
  ativa         BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE resgate_status AS ENUM ('SOLICITADO','CONSUMIDO','CANCELADO');

CREATE TABLE resgate (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  aluno_id       UUID NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
  vantagem_id    UUID NOT NULL REFERENCES vantagem(id),
  codigo         VARCHAR(40) NOT NULL UNIQUE,
  status         resgate_status NOT NULL DEFAULT 'SOLICITADO',
  solicitado_em  TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumido_em   TIMESTAMPTZ
);

CREATE TABLE transacao (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id   UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  valor        INTEGER NOT NULL CHECK (valor <> 0),
  descricao    TEXT,
  criada_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_aluno_instituicao ON aluno(instituicao_id);
CREATE INDEX idx_prof_instituicao ON professor(instituicao_id);
CREATE INDEX idx_vantagem_empresa ON vantagem(empresa_id);
CREATE INDEX idx_transacao_usuario ON transacao(usuario_id);
CREATE INDEX idx_resgate_aluno ON resgate(aluno_id);
CREATE INDEX idx_resgate_vantagem ON resgate(vantagem_id);

