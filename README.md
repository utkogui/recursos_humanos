# RH Matilha 🐺

Sistema de Gestão de Recursos Humanos desenvolvido com Next.js, Prisma e Ant Design para gerenciar colaboradores, férias e documentos de forma eficiente.

## 🚀 Funcionalidades

- **Gestão de Colaboradores**: Cadastro completo com informações pessoais, profissionais e de contato
- **Controle de Férias**: Solicitação, aprovação e acompanhamento de férias dos colaboradores
- **Gestão de Documentos**: Upload e controle de documentos com datas de vencimento
- **Dashboard**: Visão geral do RH com métricas e estatísticas
- **Interface Moderna**: Design responsivo usando Ant Design e Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **UI Components**: Ant Design 5, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite com Prisma ORM
- **Deploy**: Vercel (configurado)

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Git

## 🚀 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/rh-matilha.git
   cd rh-matilha
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure o banco de dados**
   ```bash
   # Configure a variável de ambiente DATABASE_URL no arquivo .env
   echo "DATABASE_URL=\"file:./dev.db\"" > .env
   ```

4. **Execute as migrações do banco**
   ```bash
   npx prisma migrate dev
   ```

5. **Popule o banco com dados de exemplo (opcional)**
   ```bash
   npm run seed
   ```

6. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

7. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🗄️ Estrutura do Banco de Dados

### Principais Tabelas

- **Colaboradores**: Informações pessoais, profissionais e de contato
- **Férias**: Controle de solicitações e aprovações
- **Documentos**: Gestão de arquivos e documentos
- **Departamentos**: Organização hierárquica
- **Cargos**: Estrutura de cargos e níveis

## 📁 Estrutura do Projeto

```
rh-matilha/
├── src/
│   ├── app/                 # App Router do Next.js
│   │   ├── api/            # API Routes
│   │   ├── colaboradores/  # Páginas de gestão de colaboradores
│   │   ├── ferias/         # Páginas de gestão de férias
│   │   └── documentos/     # Páginas de gestão de documentos
│   └── lib/                # Utilitários e configurações
├── prisma/                 # Schema e migrações do banco
├── public/                 # Arquivos estáticos
└── tailwind.config.js      # Configuração do Tailwind CSS
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run seed` - Popula o banco com dados de exemplo

## 🌐 Rotas da Aplicação

- `/` - Dashboard principal
- `/colaboradores` - Lista de colaboradores
- `/colaboradores/cadastrar` - Cadastro de novo colaborador
- `/ferias` - Gestão de férias
- `/ferias/solicitar` - Solicitação de férias
- `/documentos` - Gestão de documentos

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure a variável de ambiente `DATABASE_URL`
3. Deploy automático a cada push

### Outras Plataformas

- **Railway**: Suporte nativo ao Prisma
- **Render**: Configuração manual necessária
- **Heroku**: Requer PostgreSQL

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento inicial* - [Seu GitHub](https://github.com/seu-usuario)

## 🙏 Agradecimentos

- Next.js Team pelo framework incrível
- Prisma Team pela ORM moderna
- Ant Design Team pelos componentes de UI
- Tailwind CSS Team pelo framework de CSS utilitário

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma [issue](https://github.com/seu-usuario/rh-matilha/issues) no GitHub.

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
