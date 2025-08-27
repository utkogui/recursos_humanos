import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os colaboradores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const departamento = searchParams.get('departamento')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { cargo: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (status && status !== 'todos') {
      where.status = status
    }
    
    if (departamento && departamento !== 'todos') {
      where.departamento = departamento
    }

    // Buscar colaboradores com paginação
    const [colaboradores, total] = await Promise.all([
      prisma.colaborador.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nome: 'asc' },
      }),
      prisma.colaborador.count({ where })
    ])

    return NextResponse.json({
      colaboradores,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar colaboradores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo colaborador
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const requiredFields = ['nome', 'cpf', 'email', 'telefone', 'cargo', 'departamento', 'dataAdmissao', 'tipoContrato', 'salario']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        )
      }
    }

    // Verificar se CPF já existe
    const existingColaborador = await prisma.colaborador.findUnique({
      where: { cpf: body.cpf }
    })

    if (existingColaborador) {
      return NextResponse.json(
        { error: 'CPF já cadastrado' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    const existingEmail = await prisma.colaborador.findUnique({
      where: { email: body.email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 400 }
      )
    }

    // Converter datas
    const dataNascimento = new Date(body.dataNascimento)
    const dataAdmissao = new Date(body.dataAdmissao)

    // Criar colaborador
    const colaborador = await prisma.colaborador.create({
      data: {
        ...body,
        dataNascimento,
        dataAdmissao,
        salario: parseFloat(body.salario)
      }
    })

    return NextResponse.json(colaborador, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar colaborador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
