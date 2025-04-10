# Send Flow Assessment

Este é um projeto desenvolvido para gerenciar transmissões (broadcasts) utilizando Firebase como backend e React com Vite no frontend. O sistema permite criar, editar, listar e excluir transmissões, além de integrar conexões e contatos armazenados no Firebase.

---

## 🚀 Tecnologias Utilizadas

- **Frontend**: [React](https://reactjs.org/) com [Vite](https://vitejs.dev/)
- **UI Framework**: [Material-UI](https://mui.com/) e [Tailwind CSS](https://tailwindcss.com/)
- **Formulários**: [React Hook Form](https://react-hook-form.com/) com validação usando [Zod](https://zod.dev/)
- **Backend**: [Firebase](https://firebase.google.com/)
- **Notificações**: [Notistack](https://notistack.com/)
- **Roteamento**: [React Router](https://reactrouter.com/)
- **Gerenciamento de Estado**: Hooks do React

---

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [pnpm](https://pnpm.io/) ou [yarn](https://yarnpkg.com/)

### 2. Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/send-flow-assessment.git
cd send-flow-assessment
pnpm install
```

### 3. Configuração do Firebase

Crie um arquivo .env na raiz do projeto com base no .env.example e preencha as variáveis de ambiente com as credenciais do Firebase:

```bash
# Exemplo de configuração
VITE_PUBLIC_FIREBASE_API_KEY=your-api-key
VITE_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
VITE_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_PUBLIC_FIREBASE_APP_ID=your-app-id
VITE_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 4. Executando o Projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm run dev
```

O projeto estará disponível em [http://localhost:5173](http://localhost:5173).

---

### 5. Executando com Docker

Caso prefira utilizar Docker para rodar o projeto, siga os passos abaixo:

```bash
docker build -t send-flow-assessment .

docker run -p 4173:4173 send-flow-assessment
```

O projeto estará disponível em [http://localhost:4173](http://localhost:4173).

---

## 📝 Licença

Este projeto está sob a licença **MIT**. Sinta-se à vontade para usá-lo e modificá-lo conforme necessário.

---

Feito com ❤️ por Matheus Bonadio
