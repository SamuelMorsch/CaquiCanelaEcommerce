# Projeto CaquiCanela E-commerce

Este repositório contém o código-fonte completo do **CaquiCanela**, um e-commerce de roupas femininas desenvolvido como parte do projeto de extensão do curso de Análise e Desenvolvimento de Sistemas da Católica SC.  
O sistema foi criado para atender às necessidades da empresa **CaquiCanela**, que trabalha com revenda de roupas femininas, oferecendo uma plataforma moderna, intuitiva e segura para suas clientes.

# Telas
<img width="1920" height="951" alt="image" src="https://github.com/user-attachments/assets/a4be980d-68f6-4205-b5ef-fda7df4655ef" />
<img width="1920" height="952" alt="imageç" src="https://github.com/user-attachments/assets/2dd380cc-4385-4007-8e4b-3af3c4fdb667" />
<img width="1920" height="954" alt="imagekk" src="https://github.com/user-attachments/assets/b4133ec2-a24e-436c-b354-2b048bcd7ab5" />
<img width="1920" height="952" alt="image4m" src="https://github.com/user-attachments/assets/033063d6-868e-4f55-ab06-c17534a9fdca" />
<img width="1920" height="954" alt="q" src="https://github.com/user-attachments/assets/62214c0c-d9a0-427e-8f12-8dfb629aebe2" />
<img width="1920" height="951" alt="imagel" src="https://github.com/user-attachments/assets/4610d6a6-ab6e-44e6-a9d9-cc70e3442bc3" />
<img width="1920" height="952" alt="imagej" src="https://github.com/user-attachments/assets/535db6cf-367c-4c87-b2ab-29734ca1ea5f" />
<img width="1920" height="953" alt="imageh" src="https://github.com/user-attachments/assets/585d1ceb-2432-4156-bf9b-e9a1934782b8" />
<img width="1920" height="952" alt="imagen" src="https://github.com/user-attachments/assets/bb871ada-4498-41c5-9f1a-0f63de83b337" />
<img width="1920" height="952" alt="imageb" src="https://github.com/user-attachments/assets/9e28c8b0-3d68-4ede-a1d1-c554ef88de0e" />
<img width="1920" height="954" alt="imagev" src="https://github.com/user-attachments/assets/c929d35f-cef2-4b87-92a6-94992e21967f" />
<img width="1920" height="954" alt="imagea" src="https://github.com/user-attachments/assets/bd314090-3ea5-4870-8c81-103a82534f43" />
<img width="1920" height="952" alt="images" src="https://github.com/user-attachments/assets/0142fea2-9f94-4e58-bfc0-c30254dfcf87" />


---

## Estrutura do Projeto

Este é um **monorepo** que contém as duas aplicações separadas:

```
/
├── /backend/       (Servidor Node.js + Express + Sequelize)
└── /frontend/      (Cliente React + Vite + Tailwind CSS)
└── README.md       (Você está aqui)
```

### Tecnologias Utilizadas

**Backend**
- Node.js  
- Express  
- Sequelize (ORM)  
- MySQL  
- JWT + Bcrypt  
- Dotenv  

**Frontend**
- React  
- Vite  
- Tailwind CSS  
- Axios  
- React Router DOM  

---

## Como Rodar o Projeto Localmente

Você precisará ter o **Node.js (v18 ou superior)** e o **Xampp** instalados.

Para rodar o projeto completo, abra **dois terminais separados** — um para o backend e outro para o frontend.

---

### 1. Rodando o Backend (API)

No primeiro terminal:

```bash
# 1. Navegue até a pasta do backend
cd backend

# 2. Instale as dependências (apenas na primeira vez)
npm install

# 3. Inicie o servidor
npm start
```

O backend estará disponível em **http://localhost:3000**

---

### 2. Rodando o Frontend (Loja)

No segundo terminal:

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências (apenas na primeira vez)
npm install

# 3. Inicie o cliente React
npm run dev
```

O frontend estará disponível em **http://localhost:5173**  
(o Vite pode escolher outra porta, verifique no terminal).

O frontend se conecta automaticamente à API em **http://localhost:3000**.

