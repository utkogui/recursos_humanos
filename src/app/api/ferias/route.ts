import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todas as férias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const colaboradorId = searchParams.get('colaboradorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (status && status !== 'todos') {
      where.status = status
    }
    
    if (colaboradorId) {
      where.colaboradorId = parseInt(colaboradorId)
    }

    // Buscar férias com paginação e dados do colaborador
    const [ferias, total] = await Promise.all([
      prisma.ferias.findMany({
        where,
        skip,
        take: limit,
        include: {
          colaborador: {
            select: {
              id: true,
              nome: true,
              cargo: true,
              departamento: true
            }
          }
        },
        orderBy: { dataInicio: 'desc' },
      }),
      prisma.ferias.count({ where })
    ])

    return NextResponse.json({
      ferias,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar férias:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova solicitação de férias
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const requiredFields = ['colaboradorId', 'dataInicio', 'dataFim']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        )
      }
    }

    // Verificar se o colaborador existe
    const colaborador = await prisma.colaborador.findUnique({
      where: { id: parseInt(body.colaboradorId) }
    })

    if (!colaborador) {
      return NextResponse.json(
        { error: 'Colaborador não encontrado' },
        { status: 404 }
      )
    }

    // Converter datas
    const dataInicio = new Date(body.dataInicio)
    const dataFim = new Date(body.dataFim)

    // Verificar se a data de fim é posterior à data de início
    if (dataFim <= dataInicio) {
      return NextResponse.json(
        { error: 'A data de fim deve ser posterior à data de início' },
        { status: 400 }
      )
    }

    // Verificar se já existe férias no período
    const feriasExistentes = await prisma.ferias.findFirst({
      where: {
        colaboradorId: parseInt(body.colaboradorId),
        OR: [
          {
            AND: [
              { dataInicio: { lte: dataInicio } },
              { dataFim: { gte: dataInicio } }
            ]
          },
          {
            AND: [
              { dataInicio: { lte: dataFim } },
              { dataFim: { gte: dataFim } }
            ]
          },
          {
            AND: [
              { dataInicio: { gte: dataInicio } },
              { dataFim: { lte: dataFim } }
            ]
          }
        ]
      }
    })

    if (feriasExistentes) {
      return NextResponse.json(
        { error: 'Já existe férias cadastrada para este período' },
        { status: 400 }
      )
    }

    // Criar solicitação de férias
    const ferias = await prisma.ferias.create({
      data: {
        colaboradorId: parseInt(body.colaboradorId),
        dataInicio,
        dataFim,
        tipoFerias: body.tipoFerias || 'ferias_anuais',
        observacoes: body.observacoes,
        status: 'pendente'
      },
      include: {
        colaborador: {
          select: {
            id: true,
            nome: true,
            cargo: true,
            departamento: true
          }
        }
      }
    })

    return NextResponse.json(ferias, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar férias:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
