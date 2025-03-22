# Send Flow Assessment

Este é um projeto desenvolvido para gerenciar transmissões (broadcasts) utilizando Firebase como backend e React com Next.js no frontend. O sistema permite criar, editar, listar e excluir transmissões, além de integrar conexões e contatos armazenados no Firebase.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) com [Next.js](https://nextjs.org/)
- **UI Framework**: [Material-UI](https://mui.com/) e [Tailwind CSS](https://tailwindcss.com/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) com validação usando [Zod](https://zod.dev/)
- **Backend**: [Firebase](https://firebase.google.com/)
- **Autenticação**: [next-firebase-auth-edge](https://github.com/Glideh/next-firebase-auth-edge)
- **Notificações**: [Notistack](https://notistack.com/)
- **Gerenciamento de Estado**: Hooks do React

---

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/send-flow-assessment.git
cd send-flow-assessment
npm install
```

### 3. Configuração do Firebase

Crie um arquivo .env na raiz do projeto com base no .env.example e preencha as variáveis de ambiente com as credenciais do Firebase:

```bash
# Exemplo de configuração
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

FIREBASE_ADMIN_CLIENT_EMAIL=your-admin-client-email
FIREBASE_ADMIN_PRIVATE_KEY=your-admin-private-key
```

### 4. Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a build de produção.
- `npm run start`: Inicia o servidor em modo de produção.
- `npm run lint`: Executa o linter para verificar problemas no código.

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Sinta-se à vontade para usá-lo e modificá-lo conforme necessário.

---

Feito com ❤️ por Matheus Bonadio
