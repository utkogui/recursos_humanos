export const ROUTES = {
  // Dashboard
  DASHBOARD: '/',
  
  // Colaboradores
  COLABORADORES: {
    PRINCIPAL: '/colaboradores',
    LISTAR: '/colaboradores/listar',
    CADASTRAR: '/colaboradores/cadastrar',
    EDITAR: (id: number) => `/colaboradores/editar/${id}`,
    VISUALIZAR: (id: number) => `/colaboradores/${id}`,
  },
  
  // Férias
  FERIAS: {
    PRINCIPAL: '/ferias',
    LISTAR: '/ferias/listar',
    SOLICITAR: '/ferias/solicitar',
    EDITAR: (id: number) => `/ferias/editar/${id}`,
    VISUALIZAR: (id: number) => `/ferias/${id}`,
  },
  
  // Documentos
  DOCUMENTOS: {
    PRINCIPAL: '/documentos',
    LISTAR: '/documentos/listar',
    UPLOAD: '/documentos/upload',
    EDITAR: (id: number) => `/documentos/editar/${id}`,
    VISUALIZAR: (id: number) => `/documentos/${id}`,
  },
  
  // Relatórios
  RELATORIOS: {
    COLABORADORES: '/relatorios/colaboradores',
    FERIAS: '/relatorios/ferias',
    DOCUMENTOS: '/relatorios/documentos',
  },
  
  // Configurações
  CONFIGURACOES: {
    DEPARTAMENTOS: '/configuracoes/departamentos',
    CARGOS: '/configuracoes/cargos',
    USUARIOS: '/configuracoes/usuarios',
  }
} as const;

export const API_ROUTES = {
  // Dashboard
  DASHBOARD: '/api/dashboard',
  
  // Colaboradores
  COLABORADORES: {
    LISTAR: '/api/colaboradores',
    CRIAR: '/api/colaboradores',
    BUSCAR: (id: number) => `/api/colaboradores/${id}`,
    ATUALIZAR: (id: number) => `/api/colaboradores/${id}`,
    EXCLUIR: (id: number) => `/api/colaboradores/${id}`,
  },
  
  // Férias
  FERIAS: {
    LISTAR: '/api/ferias',
    CRIAR: '/api/ferias',
    BUSCAR: (id: number) => `/api/ferias/${id}`,
    ATUALIZAR: (id: number) => `/api/ferias/${id}`,
    EXCLUIR: (id: number) => `/api/ferias/${id}`,
    APROVAR: (id: number) => `/api/ferias/${id}/aprovar`,
    REPROVAR: (id: number) => `/api/ferias/${id}/reprovar`,
  },
  
  // Documentos
  DOCUMENTOS: {
    LISTAR: '/api/documentos',
    CRIAR: '/api/documentos',
    BUSCAR: (id: number) => `/api/documentos/${id}`,
    ATUALIZAR: (id: number) => `/api/documentos/${id}`,
    EXCLUIR: (id: number) => `/api/documentos/${id}`,
    DOWNLOAD: (id: number) => `/api/documentos/${id}/download`,
  },
  
  // Departamentos
  DEPARTAMENTOS: {
    LISTAR: '/api/departamentos',
    CRIAR: '/api/departamentos',
    BUSCAR: (id: number) => `/api/departamentos/${id}`,
    ATUALIZAR: (id: number) => `/api/departamentos/${id}`,
    EXCLUIR: (id: number) => `/api/departamentos/${id}`,
  },
  
  // Cargos
  CARGOS: {
    LISTAR: '/api/cargos',
    CRIAR: '/api/cargos',
    BUSCAR: (id: number) => `/api/cargos/${id}`,
    ATUALIZAR: (id: number) => `/api/cargos/${id}`,
    EXCLUIR: (id: number) => `/api/cargos/${id}`,
  }
} as const;
