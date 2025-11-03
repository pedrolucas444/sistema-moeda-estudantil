
# Banco de Dados — Sistema de Mérito Estudantil

## Como usar

1. Va para o terminal e acesse ao banco.
  ```bash
 psql -U postgres
```
2. Digite a senha criada.

3. No terminal psql, crie o banco:
  ```bash
 CREATE DATABASE meritcoins;
  \c meritcoins
```

4. Habilite as extensões usadas pelos scripts:
  ```bash
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 
  CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

5. Carregar os scripst SQL

```bash
codigo/db/
  ├── schema.sql
  ├── functions_triggers.sql
  └── seed.sql
```

6. Dentro do psql, execute nesta ordem:

 ```bash
\i 'C:\seu\caminho\sistema-moeda-estudantil-main\codigo\db\schema.sql'
\i 'C:\seu\caminho\sistema-moeda-estudantil-main\codigo\db\functions_triggers.sql'
\i 'C:\seu\caminho\sistema-moeda-estudantil-main\codigo\db\seed.sql'
```

7. 

 ```bash
\dt
```
Você deve ver:

aluno, empresa, instituicao, professor, resgate, transacao, usuario, vantagem
