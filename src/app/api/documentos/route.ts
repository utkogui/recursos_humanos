import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Listar todos os documentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tipo = searchParams.get('tipo')
    const status = searchParams.get('status')
    const colaboradorId = searchParams.get('colaboradorId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { colaborador: { nome: { contains: search, mode: 'insensitive' } } },
        { categoria: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    if (tipo && tipo !== 'todos') {
      where.tipo = tipo
    }
    
    if (status && status !== 'todos') {
      where.status = status
    }
    
    if (colaboradorId) {
      where.colaboradorId = parseInt(colaboradorId)
    }

    // Buscar documentos com paginação e dados do colaborador
    const [documentos, total] = await Promise.all([
      prisma.documento.findMany({
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
        orderBy: { dataUpload: 'desc' },
      }),
      prisma.documento.count({ where })
    ])

    return NextResponse.json({
      documentos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo documento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar dados obrigatórios
    const requiredFields = ['nome', 'colaboradorId', 'tipo', 'categoria']
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

    // Converter data de vencimento se fornecida
    let dataVencimento = null
    if (body.dataVencimento) {
      dataVencimento = new Date(body.dataVencimento)
    }

    // Criar documento
    const documento = await prisma.documento.create({
      data: {
        nome: body.nome,
        colaboradorId: parseInt(body.colaboradorId),
        tipo: body.tipo,
        categoria: body.categoria,
        dataVencimento,
        status: body.status || 'valido',
        tamanho: body.tamanho,
        caminhoArquivo: body.caminhoArquivo,
        observacoes: body.observacoes
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

    return NextResponse.json(documento, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
