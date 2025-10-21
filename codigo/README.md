# Estratégia de Acesso ao Banco de Dados

O sistema de mérito acadêmico utilizará um **banco de dados relacional MySQL**, responsável por armazenar as informações de **alunos, professores, empresas parceiras, moedas e transações**.

Para garantir uma arquitetura organizada e de fácil manutenção, será adotado o **padrão DAO (Data Access Object)**, que separa a lógica de persistência de dados da lógica de negócios da aplicação.

