'use client';

import { Layout, Card, Row, Col, Statistic, Table, Tag, Space, Typography, Button, Spin, Modal, message } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Ferias {
  id: number;
  colaboradorId: number;
  colaborador: {
    id: number;
    nome: string;
    cargo: string;
    departamento: string;
  };
  dataInicio: string;
  dataFim: string;
  tipoFerias: string;
  status: string;
  observacoes?: string;
  dataAprovacao?: string;
  aprovadoPor?: string;
}

export default function FeriasPendentes() {
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchFeriasPendentes();
  }, []);

  const fetchFeriasPendentes = async () => {
    try {
      const response = await fetch('/api/ferias?status=pendente');
      if (response.ok) {
        const data = await response.json();
        // A API retorna { ferias: [...], pagination: {...} }
        setFerias(data.ferias || []);
      }
    } catch (error) {
      console.error('Erro ao buscar férias pendentes:', error);
      setFerias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id: number) => {
    confirm({
      title: 'Aprovar Férias',
      content: 'Tem certeza que deseja aprovar estas férias?',
      onOk: async () => {
        setActionLoading(true);
        try {
          const response = await fetch(`/api/ferias/${id}/aprovar`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              aprovadoPor: 'Sistema',
              dataAprovacao: new Date().toISOString(),
            }),
          });

          if (response.ok) {
            message.success('Férias aprovadas com sucesso!');
            fetchFeriasPendentes();
          } else {
            message.error('Erro ao aprovar férias');
          }
        } catch (error) {
          message.error('Erro ao aprovar férias');
        } finally {
          setActionLoading(false);
        }
      },
    });
  };

  const handleReprovar = async (id: number) => {
    confirm({
      title: 'Reprovar Férias',
      content: 'Tem certeza que deseja reprovar estas férias?',
      onOk: async () => {
        setActionLoading(true);
        try {
          const response = await fetch(`/api/ferias/${id}/reprovar`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              observacoes: 'Férias reprovadas pelo sistema',
            }),
          });

          if (response.ok) {
            message.success('Férias reprovadas com sucesso!');
            fetchFeriasPendentes();
          } else {
            message.error('Erro ao reprovar férias');
          }
        } catch (error) {
          message.error('Erro ao reprovar férias');
        } finally {
          setActionLoading(false);
        }
      },
    });
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
      title: 'Período',
      key: 'periodo',
      render: (record: Ferias) => (
        <div>
          <div>Início: {new Date(record.dataInicio).toLocaleDateString('pt-BR')}</div>
          <div>Fim: {new Date(record.dataFim).toLocaleDateString('pt-BR')}</div>
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoFerias',
      key: 'tipoFerias',
      render: (tipo: string) => {
        const tipos = {
          'ferias_anuais': 'Férias Anuais',
          'ferias_compensacao': 'Férias de Compensação',
          'ferias_especiais': 'Férias Especiais',
        };
        return tipos[tipo as keyof typeof tipos] || tipo;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="orange" icon={<ClockCircleOutlined />}>
          Pendente
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
      render: (record: Ferias) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleAprovar(record.id)}
            loading={actionLoading}
          >
            Aprovar
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseCircleOutlined />}
            onClick={() => handleReprovar(record.id)}
            loading={actionLoading}
          >
            Reprovar
          </Button>
          <Link href={ROUTES.FERIAS.VISUALIZAR(record.id)}>
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

  const totalDias = ferias.reduce((total, ferias) => {
    const inicio = new Date(ferias.dataInicio);
    const fim = new Date(ferias.dataFim);
    const diffTime = Math.abs(fim.getTime() - inicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return total + diffDays;
  }, 0);

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Férias Pendentes
              </Title>
              <Text type="secondary">Aprovação e gestão de solicitações de férias</Text>
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
                  title="Total de Solicitações Pendentes"
                  value={ferias.length}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total de Dias Solicitados"
                  value={totalDias}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Média de Dias por Solicitação"
                  value={ferias.length > 0 ? Math.round(totalDias / ferias.length) : 0}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabela de Férias Pendentes */}
          <Card title="Solicitações Pendentes de Aprovação">
            <Table
              columns={columns}
              dataSource={ferias}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} de ${total} solicitações`,
              }}
            />
          </Card>

          {/* Ações Rápidas */}
          <Card title="Ações Rápidas">
            <Space wrap>
              <Link href={ROUTES.FERIAS.SOLICITAR}>
                <Button type="primary" icon={<CalendarOutlined />}>
                  Nova Solicitação de Férias
                </Button>
              </Link>
              <Link href={ROUTES.FERIAS.LISTAR}>
                <Button icon={<CalendarOutlined />}>
                  Ver Todas as Férias
                </Button>
              </Link>
            </Space>
          </Card>
        </Space>
      </div>
    </Layout>
  );
}
