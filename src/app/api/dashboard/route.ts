import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Estatísticas do dashboard
export async function GET(request: NextRequest) {
  try {
    // Buscar estatísticas em paralelo para melhor performance
    const [
      totalColaboradores,
      colaboradoresAtivos,
      colaboradoresInativos,
      feriasPendentes,
      feriasAprovadas,
      feriasReprovadas,
      totalFerias,
      documentosVencidos,
      documentosProximosVencimento,
      documentosValidos,
      totalDocumentos,
      novosCadastros
    ] = await Promise.all([
      // Total de colaboradores
      prisma.colaborador.count(),
      
      // Colaboradores ativos
      prisma.colaborador.count({
        where: { status: 'ativo' }
      }),
      
      // Colaboradores inativos
      prisma.colaborador.count({
        where: { status: 'inativo' }
      }),
      
      // Férias pendentes
      prisma.ferias.count({
        where: { status: 'pendente' }
      }),

      // Férias aprovadas
      prisma.ferias.count({
        where: { status: 'aprovado' }
      }),

      // Férias reprovadas
      prisma.ferias.count({
        where: { status: 'reprovado' }
      }),

      // Total de férias
      prisma.ferias.count(),
      
      // Documentos vencidos
      prisma.documento.count({
        where: {
          dataVencimento: {
            lt: new Date()
          },
          status: 'valido'
        }
      }),
      
      // Documentos próximos do vencimento (próximos 30 dias)
      prisma.documento.count({
        where: {
          dataVencimento: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          status: 'valido'
        }
      }),

      // Documentos válidos
      prisma.documento.count({
        where: { status: 'valido' }
      }),

      // Total de documentos
      prisma.documento.count(),
      
      // Novos cadastros (últimos 30 dias)
      prisma.colaborador.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ])

    // Atividades recentes
    const atividadesRecentes = await prisma.colaborador.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        nome: true,
        updatedAt: true
      }
    })

    // Colaboradores recentes para a página de colaboradores
    const colaboradoresRecentes = await prisma.colaborador.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        cargo: true,
        departamento: true,
        dataAdmissao: true,
        status: true,
        createdAt: true
      }
    })

    // Férias recentes
    const feriasRecentes = await prisma.ferias.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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

    // Documentos recentes
    const documentosRecentes = await prisma.documento.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
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

    return NextResponse.json({
      estatisticas: {
        totalColaboradores,
        colaboradoresAtivos,
        colaboradoresInativos,
        feriasPendentes,
        feriasAprovadas,
        feriasReprovadas,
        totalFerias,
        documentosVencidos,
        documentosProximosVencimento,
        documentosValidos,
        totalDocumentos,
        novosCadastros
      },
      atividadesRecentes,
      colaboradoresRecentes,
      feriasRecentes,
      documentosRecentes
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
