# Sistema de Cozinha — ETEC Bento Quirino

Sistema web para planejamento do almoço escolar da ETEC Bento Quirino. O aluno informa antecipadamente se irá almoçar e qual porção deseja; a Cozinha acompanha a demanda consolidada para preparar somente o necessário.

## Escopo fechado

- Uma única escola: **ETEC Bento Quirino**.
- Dois perfis: **Aluno** e **Cozinha**.
- Existe uma única conta da Cozinha.
- Uma refeição por dia: **almoço**.
- Segunda a sexta têm almoço; sábado e domingo aparecem na navegação com **“Não há almoço disponível”** e não aceitam respostas.
- Cardápios podem ser cadastrados pela Cozinha para datas futuras quando ela quiser.
- Um cardápio só pode ser publicado com **foto + pelo menos um ingrediente**.
- Ingredientes são registros individuais, somente com nome, sem duplicação no mesmo almoço.
- O horário limite diário é **10:30 (horário de Brasília)**.
- Depois de 10:30, alunos não podem criar/alterar pedidos e a Cozinha não pode criar/alterar o cardápio daquele dia.
- A Cozinha pode consultar datas anteriores, mas não pode alterá-las.
- O Aluno pode responder hoje e para qualquer data futura que já tenha cardápio.
- Cada aluno tem no máximo um pedido por dia; alterações sobrescrevem o mesmo registro.
- Pedidos sem resposta não entram no cálculo de produção e aparecem separadamente como **“não responderam”**.
- Porções: **200 g, 300 g, 400 g e 500 g**.
- A pré-definição responde automaticamente os dias futuros com cardápio; alterações manuais prevalecem apenas naquela data.
- Alterar a pré-definição não apaga exceções manuais.
- A tela da Cozinha recebe atualizações em tempo real, sem recarregar a página.

## Tecnologias escolhidas

As escolhas priorizam **maturidade, estabilidade e manutenção previsível**, não simplesmente a versão mais recente disponível.

### Front-end
- React 19.2.x
- Vite 8.x
- React Router 7.x
- Axios 1.x
- Socket.IO Client 4.x

### Back-end
- Node.js 22 LTS
- Express 5.x
- Sequelize 6.x
- PostgreSQL 17
- JWT
- cookie HttpOnly/Secure/SameSite
- bcryptjs
- Zod 4.x
- Multer 2.x
- Sharp 0.34.x
- Socket.IO 4.x
- Helmet
- express-rate-limit
- Nodemailer

### Testes e manutenção
- Vitest
- Supertest
- Sequelize CLI + migrations

## Estrutura

```text
Sistema_de_Cozinha_ETEC_Bento_Quirino/
├── API/
│   ├── config/
│   ├── migrations/
│   ├── tabela/
│   ├── uploads/
│   └── server.js
├── SistemaCozinha/
│   └── src/
```

## Requisitos

- Node.js 22 LTS
- npm
- PostgreSQL 17 instalado no Windows
- pgAdmin 4 (opcional, recomendado para administrar o banco)

## Configuração da API

1. Copie `API/.env.example` para `API/.env`.
2. Configure `DATABASE_URL` para o PostgreSQL local e informe a senha do usuário `cozinha`.
3. Preencha `COZINHA_EMAIL` e `COZINHA_SENHA`.
4. Defina um `JWT_SECRET` aleatório com pelo menos 32 caracteres.
5. Configure SMTP para recuperação de senha dos alunos quando quiser testar envio real.

Por padrão, a aplicação usa PostgreSQL:

```text
DATABASE_URL=postgres://cozinha:SUA_SENHA@localhost:5432/cozinha
```

O PostgreSQL roda como serviço do Windows. O sistema não depende de Docker para funcionar.

O SQLite permanece disponível somente para os testes automatizados, não sendo o banco da aplicação.

## Instalação

Com o PostgreSQL 17 instalado e o banco `cozinha` configurado, configure primeiro `API/.env`. Na primeira execução da API, aplique as migrations. Depois, mantenha dois terminais abertos.

Terminal 1 — API:

```bash
cd API
npm install
npm run db:migrate
npm run dev
```

Terminal 2 — Front-end:

```bash
cd SistemaCozinha
npm install
npm run dev
```

O `npm start` da API executa as migrations antes de iniciar o servidor.

Front-end:

```text
http://localhost:5173
```

API:

```text
http://localhost:3000
```

## Conta da Cozinha

A conta única da Cozinha é criada automaticamente na primeira inicialização, usando:

- `COZINHA_NOME`
- `COZINHA_EMAIL`
- `COZINHA_SENHA`

Esses valores não são editados pela interface do sistema.

## Segurança

- Senhas armazenadas somente como hash.
- JWT não fica disponível para JavaScript do navegador; a sessão usa cookie HttpOnly.
- API exige autenticação e autorização por perfil.
- Aluno só pode alterar/consultar os próprios pedidos.
- Limite de cinco falhas de senha, com bloqueio de 15 minutos.
- Rate limiting nas rotas de autenticação e recuperação.
- Validação de dados com Zod no backend.
- CORS restrito às origens configuradas.
- Helmet habilitado.
- Recuperação de senha por token aleatório, temporário, armazenado somente em hash e de uso único.
- TLS do PostgreSQL valida certificados por padrão quando SSL é habilitado.
- Upload de imagem validado e processado no backend.
- Erros internos não são enviados diretamente ao cliente.
- Migrations versionadas em vez de `sequelize.sync({ alter: true })` em produção.

## Regras de pré-definição

Cada aluno pode configurar uma preferência de segunda a sexta e uma porção padrão.

Quando surgir um cardápio futuro, a preferência cria automaticamente o pedido daquele aluno. Um pedido alterado manualmente pelo aluno passa a ter prioridade para aquela data.

Exemplo:

```text
Pré-definição:
segunda = vai comer / 300 g

05/10:
aluno altera para não comer

Resultado:
05/10 → não vai comer
12/10 → vai comer / 300 g
19/10 → vai comer / 300 g
```

A pré-definição geral continua armazenada.

## Testes

```bash
cd API
npm test
```

As regras críticas de autenticação, autorização, pedidos, prazo, cardápio e pré-definição devem permanecer cobertas por testes automatizados.

## Observações sobre dados antigos

A versão atual usa um novo modelo de banco. Uma instalação antiga baseada no SQLite anterior não é compatível com o schema novo. Para uma instalação limpa, use PostgreSQL e execute as migrations.
