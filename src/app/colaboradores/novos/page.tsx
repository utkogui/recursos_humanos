'use client';

import { Layout, Card, Row, Col, Statistic, Table, Tag, Space, Typography, Button, Spin, Avatar } from 'antd';
import { 
  PlusOutlined, 
  UserOutlined, 
  CalendarOutlined,
  EyeOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  TeamOutlined
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
  email: string;
  telefone: string;
  salario: number;
  createdAt: string;
}

export default function NovosCadastros() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNovosCadastros();
  }, []);

  const fetchNovosCadastros = async () => {
    try {
      const response = await fetch('/api/colaboradores?novos=true');
      if (response.ok) {
        const data = await response.json();
        // A API pode retornar { colaboradores: [...], pagination: {...} } ou array direto
        setColaboradores(data.colaboradores || data || []);
      }
    } catch (error) {
      console.error('Erro ao buscar novos cadastros:', error);
      setColaboradores([]);
    } finally {
      setLoading(false);
    }
  };

  const getDiasCadastro = (dataCadastro: string) => {
    const cadastro = new Date(dataCadastro);
    const hoje = new Date();
    const diffTime = hoje.getTime() - cadastro.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const columns = [
    {
      title: 'Colaborador',
      key: 'colaborador',
      render: (record: Colaborador) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <Text strong>{record.nome}</Text>
            <br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Cargo e Departamento',
      key: 'cargo',
      render: (record: Colaborador) => (
        <div>
          <Text strong>{record.cargo}</Text>
          <br />
          <Text type="secondary">{record.departamento}</Text>
        </div>
      ),
    },
    {
      title: 'Data de Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      render: (data: string) => (
        <div>
          <div>{new Date(data).toLocaleDateString('pt-BR')}</div>
          <Tag color="blue" icon={<CalendarOutlined />}>
            {getDiasCadastro(data)} dias
          </Tag>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color="green" icon={<PlusOutlined />}>
          Novo
        </Tag>
      ),
    },
    {
      title: 'Salário',
      dataIndex: 'salario',
      key: 'salario',
      render: (salario: number) => `R$ ${salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (record: Colaborador) => (
        <Space>
          <Link href={ROUTES.COLABORADORES.VISUALIZAR(record.id)}>
            <Button size="small" icon={<EyeOutlined />}>
              Ver
            </Button>
          </Link>
          <Link href={ROUTES.COLABORADORES.EDITAR(record.id)}>
            <Button size="small" icon={<EditOutlined />}>
              Editar
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

  const colaboradoresPorDepartamento = colaboradores.reduce((acc, colab) => {
    acc[colab.departamento] = (acc[colab.departamento] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colaboradoresPorCargo = colaboradores.reduce((acc, colab) => {
    acc[colab.cargo] = (acc[colab.cargo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSalarios = colaboradores.reduce((total, colab) => total + colab.salario, 0);

  return (
    <Layout style={{ minHeight: '100vh', padding: '24px' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                <PlusOutlined style={{ marginRight: '8px' }} />
                Novos Cadastros
              </Title>
              <Text type="secondary">Colaboradores recém-admitidos na empresa</Text>
            </div>
            <Link href={ROUTES.DASHBOARD}>
              <Button icon={<ArrowLeftOutlined />}>
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>

          {/* Estatísticas */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total de Novos Colaboradores"
                  value={colaboradores.length}
                  prefix={<PlusOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Departamentos"
                  value={Object.keys(colaboradoresPorDepartamento).length}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Cargos Diferentes"
                  value={Object.keys(colaboradoresPorCargo).length}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total de Salários"
                  value={totalSalarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  prefix="R$"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Tabela de Novos Colaboradores */}
          <Card title="Novos Colaboradores Cadastrados">
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

          {/* Resumo por Departamento */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Novos Colaboradores por Departamento">
                {Object.entries(colaboradoresPorDepartamento).map(([dept, qtd]) => (
                  <div key={dept} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <Text>{dept}</Text>
                    <Tag color="blue">{qtd}</Tag>
                  </div>
                ))}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Novos Colaboradores por Cargo">
                {Object.entries(colaboradoresPorCargo).map(([cargo, qtd]) => (
                  <div key={cargo} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <Text>{cargo}</Text>
                    <Tag color="green">{qtd}</Tag>
                  </div>
                ))}
              </Card>
            </Col>
          </Row>

          {/* Ações Rápidas */}
          <Card title="Ações Rápidas">
            <Space wrap>
              <Link href={ROUTES.COLABORADORES.CADASTRAR}>
                <Button type="primary" icon={<PlusOutlined />}>
                  Cadastrar Novo Colaborador
                </Button>
              </Link>
              <Link href={ROUTES.COLABORADORES.LISTAR}>
                <Button icon={<TeamOutlined />}>
                  Ver Todos os Colaboradores
                </Button>
              </Link>
            </Space>
          </Card>
        </Space>
      </div>
    </Layout>
  );
}
