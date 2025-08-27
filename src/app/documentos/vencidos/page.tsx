'use client';

import { Layout, Card, Row, Col, Statistic, Table, Tag, Space, Typography, Button, Spin, Modal, message } from 'antd';
import { 
  FileTextOutlined, 
  ExclamationCircleOutlined, 
  DownloadOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Documento {
  id: number;
  nome: string;
  tipo: string;
  categoria: string;
  dataUpload: string;
  dataVencimento: string;
  status: string;
  colaborador: {
    id: number;
    nome: string;
    cargo: string;
    departamento: string;
  };
  observacoes?: string;
}

export default function DocumentosVencidos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDocumentosVencidos();
  }, []);

  const fetchDocumentosVencidos = async () => {
    try {
      const response = await fetch('/api/documentos?status=vencido');
      if (response.ok) {
        const data = await response.json();
        setDocumentos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar documentos vencidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenovar = async (id: number) => {
    confirm({
      title: 'Renovar Documento',
      content: 'Tem certeza que deseja marcar este documento como renovado?',
      onOk: async () => {
        setActionLoading(true);
        try {
          const response = await fetch(`/api/documentos/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'valido',
              dataVencimento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // +1 ano
            }),
          });

          if (response.ok) {
            message.success('Documento renovado com sucesso!');
            fetchDocumentosVencidos();
          } else {
            message.error('Erro ao renovar documento');
          }
        } catch (error) {
          message.error('Erro ao renovar documento');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const getDiasVencido = (dataVencimento: string) => {
    const vencimento = new Date(dataVencimento);
    const hoje = new Date();
    const diffTime = hoje.getTime() - vencimento.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTipoDocumento = (tipo: string) => {
    const tipos = {
      'contrato': 'Contrato',
      'identidade': 'Identidade',
      'militar': 'Militar',
      'academico': 'Acadêmico',
      'saude': 'Saúde',
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  const columns = [
    {
      title: 'Colaborador',
      dataIndex: 'colaborador',
      key: 'colaborador',
      render: (colaborador: any) => (
        <div>
          <Text strong>{colaborador.nome}</Text>
          <br />
          <Text type="secondary">{colaborador.cargo} - {colaborador.departamento}</Text>
        </div>
      ),
    },
    {
      title: 'Documento',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome: string, record: Documento) => (
        <div>
          <Text strong>{nome}</Text>
          <br />
          <Text type="secondary">
            {getTipoDocumento(record.tipo)} - {record.categoria}
          </Text>
        </div>
      ),
    },
    {
      title: 'Data de Vencimento',
      dataIndex: 'dataVencimento',
      key: 'dataVencimento',
      render: (data: string) => (
        <div>
          <div>{new Date(data).toLocaleDateString('pt-BR')}</div>
          <Tag color="red" icon={<ExclamationCircleOutlined />}>
            Vencido há {getDiasVencido(data)} dias
          </Tag>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="red" icon={<WarningOutlined />}>
          Vencido
        </Tag>
      ),
    },
    {
      title: 'Observações',
      dataIndex: 'observacoes',
      key: 'observacoes',
      render: (obs: string) => obs || '-',
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (record: Documento) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleRenovar(record.id)}
            loading={actionLoading}
          >
            Renovar
          </Button>
          <Link href={ROUTES.DOCUMENTOS.VISUALIZAR(record.id)}>
            <Button size="small" icon={<EyeOutlined />}>
              Ver
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  const totalDiasVencidos = documentos.reduce((total, doc) => {
    return total + getDiasVencido(doc.dataVencimento);
  }, 0);

  const documentosPorTipo = documentos.reduce((acc, doc) => {
    acc[doc.tipo] = (acc[doc.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <FileTextOutlined style={{ marginRight: '8px' }} />
                Documentos Vencidos
              </Title>
              <Text type="secondary">Gestão e renovação de documentos expirados</Text>
            </div>
            <Link href={ROUTES.DASHBOARD}>
              <Button icon={<ArrowLeftOutlined />}>
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>

          {/* Estatísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total de Documentos Vencidos"
                  value={documentos.length}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Média de Dias Vencidos"
                  value={documentos.length > 0 ? Math.round(totalDiasVencidos / documentos.length) : 0}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Tipos de Documentos"
                  value={Object.keys(documentosPorTipo).length}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabela de Documentos Vencidos */}
          <Card title="Documentos Vencidos - Ação Necessária">
            <Table
              columns={columns}
              dataSource={documentos}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} de ${total} documentos`,
              }}
            />
          </Card>

          {/* Ações Rápidas */}
          <Card title="Ações Rápidas">
            <Space wrap>
              <Link href={ROUTES.DOCUMENTOS.UPLOAD}>
                <Button type="primary" icon={<FileTextOutlined />}>
                  Upload de Novo Documento
                </Button>
              </Link>
              <Link href={ROUTES.DOCUMENTOS.LISTAR}>
                <Button icon={<FileTextOutlined />}>
                  Ver Todos os Documentos
                </Button>
              </Link>
            </Space>
          </Card>
        </Space>
      </div>
    </Layout>
  );
}
