import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar departamentos
  const departamentos = [
    { nome: 'Tecnologia', descricao: 'Departamento de Tecnologia da Informação' },
    { nome: 'Design', descricao: 'Departamento de Design e UX/UI' },
    { nome: 'Marketing', descricao: 'Departamento de Marketing e Comunicação' },
    { nome: 'RH', descricao: 'Recursos Humanos' },
    { nome: 'Financeiro', descricao: 'Departamento Financeiro' },
    { nome: 'Vendas', descricao: 'Departamento de Vendas' },
  ]

  for (const dept of departamentos) {
    await prisma.departamento.upsert({
      where: { nome: dept.nome },
      update: {},
      create: dept,
    })
  }

  // Criar cargos
  const cargos = [
    { nome: 'Desenvolvedor Full Stack', descricao: 'Desenvolvedor com conhecimento em frontend e backend', nivel: 3 },
    { nome: 'Designer UX/UI', descricao: 'Designer especializado em experiência do usuário', nivel: 2 },
    { nome: 'Analista de Marketing', descricao: 'Analista de marketing digital e estratégias', nivel: 2 },
    { nome: 'Recrutadora', descricao: 'Recrutadora e selecionadora de talentos', nivel: 2 },
    { nome: 'Gerente de Projetos', descricao: 'Gerente de projetos de tecnologia', nivel: 4 },
  ]

  for (const cargo of cargos) {
    await prisma.cargo.upsert({
      where: { nome: cargo.nome },
      update: {},
      create: cargo,
    })
  }

  // Criar colaboradores
  const colaboradores = [
    {
      nome: 'João Silva',
      cpf: '123.456.789-00',
      dataNascimento: new Date('1990-05-15'),
      genero: 'masculino',
      estadoCivil: 'solteiro',
      nacionalidade: 'Brasileira',
      email: 'joao.silva@empresa.com',
      telefone: '(11) 99999-9999',
      celular: '(11) 88888-8888',
      cargo: 'Desenvolvedor Full Stack',
      departamento: 'Tecnologia',
      dataAdmissao: new Date('2023-01-15'),
      tipoContrato: 'clt',
      salario: 8500.00,
      status: 'ativo',
      rg: '12.345.678-9',
      orgaoEmissor: 'SSP',
      pis: '123.45678.90-1',
      ctps: '1234567890123456',
    },
    {
      nome: 'Maria Santos',
      cpf: '987.654.321-00',
      dataNascimento: new Date('1988-12-20'),
      genero: 'feminino',
      estadoCivil: 'casado',
      nacionalidade: 'Brasileira',
      email: 'maria.santos@empresa.com',
      telefone: '(11) 77777-7777',
      celular: '(11) 66666-6666',
      cargo: 'Designer UX/UI',
      departamento: 'Design',
      dataAdmissao: new Date('2023-03-20'),
      tipoContrato: 'clt',
      salario: 7200.00,
      status: 'ativo',
      rg: '98.765.432-1',
      orgaoEmissor: 'SSP',
      pis: '987.65432.10-9',
      ctps: '9876543210987654',
    },
    {
      nome: 'Pedro Costa',
      cpf: '456.789.123-00',
      dataNascimento: new Date('1992-08-10'),
      genero: 'masculino',
      estadoCivil: 'solteiro',
      nacionalidade: 'Brasileira',
      email: 'pedro.costa@empresa.com',
      telefone: '(11) 55555-5555',
      celular: '(11) 44444-4444',
      cargo: 'Analista de Marketing',
      departamento: 'Marketing',
      dataAdmissao: new Date('2022-11-10'),
      tipoContrato: 'clt',
      salario: 6800.00,
      status: 'ativo',
      rg: '45.678.912-3',
      orgaoEmissor: 'SSP',
      pis: '456.78912.34-5',
      ctps: '4567891234567890',
    },
  ]

  for (const colab of colaboradores) {
    await prisma.colaborador.upsert({
      where: { cpf: colab.cpf },
      update: {},
      create: colab,
    })
  }

  // Criar férias
  const ferias = [
    {
      colaboradorId: 1,
      dataInicio: new Date('2024-01-15'),
      dataFim: new Date('2024-01-30'),
      tipoFerias: 'ferias_anuais',
      status: 'aprovado',
      observacoes: 'Férias de verão',
      aprovadoPor: 'Ana Oliveira',
      dataAprovacao: new Date('2023-12-20'),
    },
    {
      colaboradorId: 2,
      dataInicio: new Date('2024-02-01'),
      dataFim: new Date('2024-02-15'),
      tipoFerias: 'ferias_anuais',
      status: 'pendente',
      observacoes: 'Férias de carnaval',
    },
  ]

  for (const feriasItem of ferias) {
    await prisma.ferias.create({
      data: feriasItem,
    })
  }

  // Criar documentos
  const documentos = [
    {
      colaboradorId: 1,
      nome: 'Contrato de Trabalho - João Silva',
      tipo: 'contrato',
      categoria: 'Contratos',
      dataVencimento: new Date('2025-01-15'),
      status: 'valido',
      tamanho: '2.5 MB',
      observacoes: 'Contrato CLT padrão',
    },
    {
      colaboradorId: 2,
      nome: 'RG - Maria Santos',
      tipo: 'identidade',
      categoria: 'Documentos Pessoais',
      dataVencimento: new Date('2024-12-31'),
      status: 'valido',
      tamanho: '1.8 MB',
      observacoes: 'RG atualizado',
    },
    {
      colaboradorId: 3,
      nome: 'Certificado de Reservista - Pedro Costa',
      tipo: 'militar',
      categoria: 'Documentos Militares',
      dataVencimento: new Date('2024-03-15'),
      status: 'vencido',
      tamanho: '1.2 MB',
      observacoes: 'Documento vencido - solicitar renovação',
    },
  ]

  for (const doc of documentos) {
    await prisma.documento.create({
      data: doc,
    })
  }

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
