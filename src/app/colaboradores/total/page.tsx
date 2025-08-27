'use client';

import { Layout, Card, Row, Col, Statistic, Table, Tag, Space, Typography, Button, Spin } from 'antd';
import { 
  TeamOutlined, 
  UserOutlined, 
  UserDeleteOutlined,
  ArrowLeftOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const { Title, Text } = Typography;

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: string;
  salario: number;
}

interface Estatisticas {
  totalColaboradores: number;
  colaboradoresAtivos: number;
  colaboradoresInativos: number;
  porDepartamento: Array<{
    departamento: string;
    quantidade: number;
  }>;
  porCargo: Array<{
    cargo: string;
    quantidade: number;
  }>;
}

export default function TotalColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [colabResponse, statsResponse] = await Promise.all([
        fetch('/api/colaboradores'),
        fetch('/api/dashboard')
      ]);

      if (colabResponse.ok) {
        const colabData = await colabResponse.json();
        // A API pode retornar { colaboradores: [...], pagination: {...} } ou array direto
        setColaboradores(colabData.colaboradores || colabData || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setEstatisticas(statsData.estatisticas);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setColaboradores([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Colaborador) => (
        <Link href={ROUTES.COLABORADORES.VISUALIZAR(record.id)}>
          <Text style={{ color: '#1890ff', cursor: 'pointer' }}>{text}</Text>
        </Link>
      ),
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
    },
    {
      title: 'Departamento',
      dataIndex: 'departamento',
      key: 'departamento',
    },
    {
      title: 'Data de Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ativo' ? 'green' : 'red'}>
          {status === 'ativo' ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
    },
    {
      title: 'Salário',
      dataIndex: 'salario',
      key: 'salario',
      render: (salario: number) => `R$ ${salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
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

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <TeamOutlined style={{ marginRight: '8px' }} />
                Total de Colaboradores
              </Title>
              <Text type="secondary">Visão geral completa da equipe</Text>
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
                  title="Total de Colaboradores"
                  value={estatisticas?.totalColaboradores || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Colaboradores Ativos"
                  value={estatisticas?.colaboradoresAtivos || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Colaboradores Inativos"
                  value={estatisticas?.colaboradoresInativos || 0}
                  prefix={<UserDeleteOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabela de Colaboradores */}
          <Card title="Lista Completa de Colaboradores">
            <Table
              columns={columns}
              dataSource={colaboradores}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} de ${total} colaboradores`,
              }}
            />
          </Card>

          {/* Ações Rápidas */}
          <Card title="Ações Rápidas">
            <Space wrap>
              <Link href={ROUTES.COLABORADORES.CADASTRAR}>
                <Button type="primary" icon={<UserOutlined />}>
                  Cadastrar Novo Colaborador
                </Button>
              </Link>
              <Link href={ROUTES.COLABORADORES.LISTAR}>
                <Button icon={<BarChartOutlined />}>
                  Ver Lista Completa
                </Button>
              </Link>
            </Space>
          </Card>
        </Space>
      </div>
    </Layout>
  );
}
