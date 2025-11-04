# Estratégia de Acesso ao Banco de Dados

O sistema de mérito acadêmico utilizará um **banco de dados relacional MySQL**, responsável por armazenar as informações de **alunos, professores, empresas parceiras, moedas e transações**.

Para garantir uma arquitetura organizada e de fácil manutenção, será adotado o **padrão DAO (Data Access Object)**, que separa a lógica de persistência de dados da lógica de negócios da aplicação.

# Como a persistência de dados ocorre

## Instanciar uma empresa
### Para isso a gente usa o curl que é uma forma rápida e simples de fazer requisições HTTP/HTTPS

1- post de uma empresa
```bash
curl -i -X POST http://localhost:3000/empresas \
  -H 'Content-Type: application/json' \
  -d '{
    "nome":"Nova Empresa Exemplo",
    "cnpj":"11.222.333/0001-44",
    "emailComercial":"contato@nova.example",
    "senha_hash":"SENHA_HASH_EXemplo"
  }'
"
```

2- get de uma empresa
```
curl -i http://localhost:3000/empresas
```

3- put de uma empresa
```
curl -i -X PUT http://localhost:3000/empresas/7ae800a3-7774-426a-bdf1-8ea0d3b3ab9c \
  -H 'Content-Type: application/json' \
  -d '{
    "nome":"Empresa Teste Atualizada",
    "emailComercial":"novo-comercial@teste.com"
  }'
```

4- delete de uma empresa
```
curl -i -X DELETE http://localhost:3000/empresas/7ae800a3-7774-426a-bdf1-8ea0d3b3ab9c
```