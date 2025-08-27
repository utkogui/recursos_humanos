'use client';

export default function ColaboradoresPage() {
  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>
          Gerenciamento de Colaboradores
        </h1>
        <div>
          <a href="/colaboradores/cadastrar">
            <button style={{ 
              backgroundColor: '#1890ff', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px',
              marginRight: '8px'
            }}>
              Novo Colaborador
            </button>
          </a>
          <a href="/">
            <button style={{ 
              backgroundColor: 'white', 
              color: '#1890ff', 
              border: '1px solid #1890ff', 
              padding: '8px 16px', 
              borderRadius: '6px'
            }}>
              Voltar ao Dashboard
            </button>
          </a>
        </div>
      </div>
      
      {/* Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Total de Colaboradores</h3>
          <div style={{ fontSize: '32px', color: '#1890ff', fontWeight: 'bold' }}>
            3
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Colaboradores Ativos</h3>
          <div style={{ fontSize: '32px', color: '#52c41a', fontWeight: 'bold' }}>
            3
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Colaboradores Inativos</h3>
          <div style={{ fontSize: '32px', color: '#ff4d4f', fontWeight: 'bold' }}>
            0
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Novos Cadastros</h3>
          <div style={{ fontSize: '32px', color: '#722ed1', fontWeight: 'bold' }}>
            3
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>Ações Rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/colaboradores/cadastrar">
              <button style={{ 
                backgroundColor: '#1890ff', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px'
              }}>
                Cadastrar Novo Colaborador
              </button>
            </a>
            <a href="/colaboradores/listar">
              <button style={{ 
                backgroundColor: 'white', 
                color: '#1890ff', 
                border: '1px solid #1890ff', 
                padding: '12px', 
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px'
              }}>
                Ver Todos os Colaboradores
              </button>
            </a>
            <a href="/ferias/listar">
              <button style={{ 
                backgroundColor: 'white', 
                color: '#1890ff', 
                border: '1px solid #1890ff', 
                padding: '12px', 
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px'
              }}>
                Gerenciar Férias
              </button>
            </a>
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>Colaboradores Recentes</h2>
          <div>
            <div style={{ 
              padding: '8px 0', 
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>João Silva</strong>
                <br />
                <span style={{ color: '#666' }}>Desenvolvedor Full Stack - Tecnologia</span>
              </div>
              <span style={{ 
                backgroundColor: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Ativo
              </span>
            </div>
            <div style={{ 
              padding: '8px 0', 
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>Maria Santos</strong>
                <br />
                <span style={{ color: '#666' }}>Designer UX/UI - Design</span>
              </div>
              <span style={{ 
                backgroundColor: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Ativo
              </span>
            </div>
            <div style={{ 
              padding: '8px 0', 
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>Pedro Costa</strong>
                <br />
                <span style={{ color: '#666' }}>Analista de Marketing - Marketing</span>
              </div>
              <span style={{ 
                backgroundColor: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Ativo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
