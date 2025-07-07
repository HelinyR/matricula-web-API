# **matricula-web-API**

API RESTful para o sistema M4tr1cul4: gerenciamento de matrículas, metas, desempenho de atendentes e auditoria de acessos para universidades.

---

## **Visão do Projeto**

O M4tr1cul4 é uma solução web para automatizar e organizar o processo de matrícula de candidatos, acompanhamento de desempenho de atendentes, cálculo de comissões e geração de relatórios para supervisores. O sistema visa garantir eficiência, transparência e controle sobre as metas e matrículas, substituindo processos manuais e desorganizados.

---

## **Sumário**
- [Visão Geral](__#visão-do-projeto__)
- [Como rodar o projeto](__#como-rodar-o-projeto__)
- [Variáveis de ambiente](__#variáveis-de-ambiente__)
- [Estrutura do projeto](__#estrutura-do-projeto__)
- [Papéis e responsabilidades](__#papéis-e-responsabilidades__)
- [Funcionalidades principais](__#funcionalidades-principais__)
- [Auditoria de tentativas de login](__#auditoria-de-tentativas-de-login__)
- [Restrições e premissas](__#restrições-e-premissas__)
- [Observações](__#observações__)

---

## **Como rodar o projeto**

1. ****Clone o repositório:****
   ```sh
   git clone https://github.com/HelinyR/matricula-web-API.git
   cd matricula-web-API
   ```

2. ****Instale as dependências:****
   ```sh
   npm install
   ```

3. ****Configure as variáveis de ambiente:****
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   JWT_SECRET=sua_chave_secreta
   JWT_EXPIRES_IN=1h
   PORT=3000
   ```

4. ****Configure o banco de dados:****
   - Execute o script `bd.sql` para criar as tabelas.
   - Certifique-se de que a tabela `TentativasLogin` está conforme o modelo:
     ```sql
     CREATE TABLE TentativasLogin (
         id INT AUTO_INCREMENT PRIMARY KEY,
         email VARCHAR(255) NOT NULL,
         ip VARCHAR(45) NOT NULL,
         tentativas INT NOT NULL,
         ultimo_erro DATETIME NOT NULL,
         cargo VARCHAR(50) NOT NULL
     );
     ```

5. ****Inicie o servidor:****
   ```sh
   npm start
   ```
   O servidor rodará por padrão em `http://localhost:3000`.

---

## **Estrutura do projeto**

```
matricula-web-API/
├── bd.sql
├── package.json
├── README.md
└── src/
    ├── db.js
    ├── server.js
    ├── controllers/
    │   ├── loginController.js
    │   ├── supervisorController.js
    │   ├── atendenteController.js
    │   └── candidatoController.js
    ├── middleware/
    │   └── autenticarJWT.js
    ├── routes/
    │   ├── loginRoutes.js
    │   ├── supervisorRoutes.js
    │   ├── atendenteRoutes.js
    │   └── candidatoRoutes.js
    └── utils/
        ├── jwt.js
        └── validacao.js
```

---

## **Papéis e responsabilidades**

- ****Atendente:**** Realiza matrículas, registra dados dos candidatos, cumpre metas e recebe comissões. Tem acesso ao sistema para inserir e consultar matrículas.
- ****Supervisor:**** Cadastra e gerencia atendentes, monitora desempenho, avalia metas, gera relatórios e aprova matrículas. Tem acesso a todas as informações e funcionalidades administrativas.
- ****Candidato:**** (Apenas registrado por atendentes) Não acessa o sistema diretamente.

---

## **Funcionalidades principais**

- ****Gestão de Atendentes:**** Cadastro, atualização, busca, exclusão, login, logout e recuperação de senha.
- ****Gestão de Supervisores:**** Cadastro, atualização, busca, exclusão, login, logout e recuperação de senha.
- ****Gestão de Matrículas:**** Cadastro de candidatos, atualização, busca, exclusão e cálculo de comissão por matrícula.
- ****Gestão de Metas:**** Acompanhamento do progresso dos atendentes, geração de relatórios mensais e gráficos comparativos.
- ****Autenticação Segura:**** JWT para todas as rotas protegidas, controle de tentativas de login, bloqueio temporário e auditoria.
- ****Auditoria:**** Registro detalhado de todas as tentativas de login, com histórico para análise e segurança.

---

## **Auditoria de tentativas de login**

Todas as tentativas de login (sucesso ou falha) de supervisores e atendentes são registradas na tabela `TentativasLogin`.

- ****Campos:**** `email`, `ip`, `tentativas`, `ultimo_erro`, `cargo`
- ****Uso:**** Permite rastrear ciclos de bloqueio, horários, IPs e padrões de acesso.
- ****Exemplo de consulta:****
  ```sql
  SELECT * FROM TentativasLogin ORDER BY ultimo_erro DESC;
  ```

---

## **Restrições e premissas**

- O sistema é acessível apenas via web (desktop), não há versão mobile.
- Não há integração com sistemas de pagamento, nem gestão financeira de boletos ou taxas.
- O controle de cursos e unidades é feito fora do sistema.
- Apenas atendentes e supervisores acessam o sistema; candidatos não têm acesso direto.
- Relatórios devem ser gerados rapidamente e podem ser exportados em PDF/Excel.
- O sistema pode funcionar off-line, mas a autenticação e registro de tentativas dependem do banco.
- A equipe de suporte da universidade é responsável por backups e infraestrutura.

---

## **Observações**

- JWT é utilizado para autenticação de todas as rotas protegidas.
- O controle de tentativas de login é feito por email, IP e cargo, com bloqueio temporário e histórico para auditoria.
- O sistema foi desenvolvido por Heliny Ramos Oliveira, sob coordenação de Renan José Maia da Silva.
- Para dúvidas, melhorias ou problemas, consulte os comentários no código ou abra uma issue.