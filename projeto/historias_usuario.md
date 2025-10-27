# Histórias de Usuário — Sistema de Mérito Acadêmico

> **Papel**: Alunos, Professores, Empresas Parceiras, Administrador/Instituição  
> **Objetivo**: Distribuir e trocar moedas de reconhecimento acadêmico; gerenciar parceiros e vantagens; manter rastreabilidade das transações.  
> **Critérios de aceite**: Sempre descritos como *Given/When/Then*.

---

## HU01 — Cadastro de aluno
**Como** candidato a aluno  
**Quero** me cadastrar informando nome, email, CPF, RG, endereço, instituição e curso  
**Para** acessar o sistema e receber moedas dos professores  

**Critérios de aceite**
- *Given* que a instituição já existe no sistema, *When* eu seleciono a instituição e preencho os campos obrigatórios, *Then* meu cadastro deve ser criado e um usuário autenticável gerado (status “pendente de verificação de email”).
- CPF e email devem ser únicos.
- Campos obrigatórios: nome, email, CPF, RG, endereço, instituição, curso, senha.

---

## HU02 — Cadastro de professor (pré-cadastrado pela instituição)
**Como** instituição parceira  
**Quero** pré-cadastrar professores com nome, CPF, departamento e instituição  
**Para** permitir que eles distribuam moedas aos alunos

**Critérios de aceite**
- Ao primeiro acesso, o professor define a senha e confirma o email.
- Professor deve estar vinculado a **uma** instituição e **um** departamento.
- A cada semestre, o saldo do professor recebe crédito de **1000 moedas** acumuláveis.

---

## HU03 — Login e autenticação
**Como** qualquer usuário (aluno, professor, empresa)  
**Quero** entrar com email e senha  
**Para** acessar as funcionalidades conforme meu perfil

**Critérios de aceite**
- Autenticação por email/senha com hashing seguro.
- Bloqueio após N tentativas falhas e recuperação de senha por email.
- Perfis/roles: ALUNO, PROFESSOR, EMPRESA, ADMIN.

---

## HU04 — Enviar moedas para aluno
**Como** professor  
**Quero** enviar moedas para um aluno informando um motivo obrigatório  
**Para** reconhecer desempenho/comportamento

**Critérios de aceite**
- *Given* que tenho saldo suficiente, *When* envio X moedas para um aluno, *Then* o saldo do professor diminui e o do aluno aumenta, gerando um **lançamento de crédito** para o aluno e **débito** para o professor.
- Enviar notificação por email ao aluno com o motivo.
- Não permitir envio com saldo insuficiente.

---

## HU05 — Consultar extrato
**Como** professor **ou** aluno  
**Quero** ver meu saldo e o extrato de transações  
**Para** acompanhar envios, recebimentos e trocas

**Critérios de aceite**
- Listar operações (data/hora, tipo, contrapartes, valor, mensagem/código).
- Filtros por período e tipo (ENVIO, RECEBIMENTO, TROCA).
- Saldo atual visível no topo.

---

## HU06 — Cadastro de empresa parceira
**Como** empresa  
**Quero** me cadastrar e gerenciar minhas vantagens  
**Para** oferecer benefícios aos alunos em troca de moedas

**Critérios de aceite**
- Empresa informa dados básicos (nome, CNPJ, email, endereço, contato) e cria usuário.
- Após aprovação do ADMIN, empresa pode cadastrar vantagens.

---

## HU07 — Cadastrar vantagem (benefício)
**Como** empresa parceira  
**Quero** cadastrar vantagens com título, descrição, foto e custo (em moedas)  
**Para** que alunos possam resgatar

**Critérios de aceite**
- Upload de imagem obrigatório (tamanho máximo e formatos comuns).
- Custo em moedas inteiro e positivo.
- Vantagem pode ser ativada/desativada sem perda de histórico.

---

## HU08 — Resgatar vantagem
**Como** aluno  
**Quero** trocar moedas por uma vantagem cadastrada  
**Para** utilizar um benefício oferecido por parceiros

**Critérios de aceite**
- *Given* saldo suficiente, *When* confirmo o resgate, *Then* é gerado um **código de cupom** único, abatido o valor do saldo e enviados **dois emails**: um para o aluno e outro para a empresa parceira.
- O cupom possui status (GERADO, UTILIZADO, CANCELADO) e validade configurável.
- Lança débito no extrato do aluno.

---

## HU09 — Recebimento de cota semestral (professor)
**Como** sistema  
**Quero** creditar 1000 moedas a cada professor a cada semestre  
**Para** repor o saldo para novas distribuições

**Critérios de aceite**
- Regra de negócio executada por job agendado (ex.: 01/fev e 01/ago) **ou** por cálculo com base no período corrente.
- Lançamento no extrato do professor com descrição “Cota semestral”.

---

## HU10 — Administração de instituições e departamentos
**Como** administrador  
**Quero** manter instituições e departamentos  
**Para** permitir o vínculo correto de alunos e professores

**Critérios de aceite**
- Instituições e departamentos possuem cadastros com ativação/desativação.
- Não permitir remover instituição com vínculos ativos.

---

## HU11 — Auditoria e rastreabilidade
**Como** administrador  
**Quero** consultar logs de transações e cupons  
**Para** auditar fraudes e inconsistências

**Critérios de aceite**
- Toda transação deve possuir identificador, autor, timestamps e trilha (from_wallet/to_wallet).
- Exportação CSV do período selecionado.
