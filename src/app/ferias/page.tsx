'use client';

export default function FeriasPage() {
  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>
          Gerenciamento de Férias
        </h1>
        <div>
          <a href="/ferias/solicitar">
            <button style={{ 
              backgroundColor: '#1890ff', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px',
              marginRight: '8px'
            }}>
              Nova Solicitação
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
          <h3>Total de Férias</h3>
          <div style={{ fontSize: '32px', color: '#1890ff', fontWeight: 'bold' }}>
            4
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Férias Pendentes</h3>
          <div style={{ fontSize: '32px', color: '#faad14', fontWeight: 'bold' }}>
            2
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Férias Aprovadas</h3>
          <div style={{ fontSize: '32px', color: '#52c41a', fontWeight: 'bold' }}>
            2
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Férias Reprovadas</h3>
          <div style={{ fontSize: '32px', color: '#ff4d4f', fontWeight: 'bold' }}>
            0
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
            <a href="/ferias/solicitar">
              <button style={{ 
                backgroundColor: '#1890ff', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px'
              }}>
                Solicitar Férias
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
                Ver Todas as Solicitações
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
                Gerenciar Colaboradores
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
          <h2>Solicitações Recentes</h2>
          <div>
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
                <span style={{ color: '#666' }}>01/02/2024 - 15/02/2024</span>
              </div>
              <span style={{ 
                backgroundColor: '#faad14',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Pendente
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
                <strong>João Silva</strong>
                <br />
                <span style={{ color: '#666' }}>15/01/2024 - 30/01/2024</span>
              </div>
              <span style={{ 
                backgroundColor: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Aprovado
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
                <span style={{ color: '#666' }}>10/03/2024 - 25/03/2024</span>
              </div>
              <span style={{ 
                backgroundColor: '#faad14',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Pendente
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
