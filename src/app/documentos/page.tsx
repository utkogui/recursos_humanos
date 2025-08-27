'use client';

export default function DocumentosPage() {
  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{ margin: 0, color: '#1890ff' }}>
          Gerenciamento de Documentos
        </h1>
        <div>
          <a href="/documentos/upload">
            <button style={{ 
              backgroundColor: '#1890ff', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '6px',
              marginRight: '8px'
            }}>
              Upload de Documento
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
          <h3>Total de Documentos</h3>
          <div style={{ fontSize: '32px', color: '#1890ff', fontWeight: 'bold' }}>
            6
          </div>
        </div>
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3>Documentos Válidos</h3>
          <div style={{ fontSize: '32px', color: '#52c41a', fontWeight: 'bold' }}>
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
          <h3>Próximos do Vencimento</h3>
          <div style={{ fontSize: '32px', color: '#faad14', fontWeight: 'bold' }}>
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
          <h3>Documentos Vencidos</h3>
          <div style={{ fontSize: '32px', color: '#ff4d4f', fontWeight: 'bold' }}>
            4
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
            <a href="/documentos/upload">
              <button style={{ 
                backgroundColor: '#1890ff', 
                color: 'white', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px'
              }}>
                Upload de Documento
              </button>
            </a>
            <a href="/documentos/listar">
              <button style={{ 
                backgroundColor: 'white', 
                color: '#1890ff', 
                border: '1px solid #1890ff', 
                padding: '12px', 
                borderRadius: '6px',
                width: '100%',
                fontSize: '16px'
              }}>
                Ver Todos os Documentos
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
          <h2>Documentos Recentes</h2>
          <div>
            <div style={{ 
              padding: '8px 0', 
              borderBottom: '1px solid #f0f0f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong>RG - Maria Santos</strong>
                <br />
                <span style={{ color: '#666' }}>Documentos Pessoais</span>
              </div>
              <span style={{ 
                backgroundColor: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Válido
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
                <strong>Certificado de Reservista - Pedro Costa</strong>
                <br />
                <span style={{ color: '#666' }}>Documentos Militares</span>
              </div>
              <span style={{ 
                backgroundColor: '#ff4d4f',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Vencido
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
                <strong>Contrato de Trabalho - João Silva</strong>
                <br />
                <span style={{ color: '#666' }}>Contratos</span>
              </div>
              <span style={{ 
                backgroundColor: '#52c41a',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Válido
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
