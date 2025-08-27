'use client';

import { Layout, Menu, Card, Row, Col, Statistic, Button, Typography, Space, Spin } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  FileTextOutlined,
  PlusOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface DashboardData {
  estatisticas: {
    totalColaboradores: number;
    colaboradoresAtivos: number;
    colaboradoresInativos: number;
    feriasPendentes: number;
    documentosVencidos: number;
    documentosProximosVencimento: number;
    novosCadastros: number;
  };
  atividadesRecentes: Array<{
    id: number;
    nome: string;
    updatedAt: string;
  }>;
  feriasRecentes: Array<{
    id: number;
    dataInicio: string;
    dataFim: string;
    status: string;
    colaborador: {
      id: number;
      nome: string;
      cargo: string;
    };
  }>;
  documentosRecentes: Array<{
    id: number;
    nome: string;
    status: string;
    colaborador: {
      id: number;
      nome: string;
      cargo: string;
    };
  }>;
}

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Erro ao buscar dados do dashboard');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
    },
    {
      key: 'colaboradores',
      label: 'Colaboradores',
      children: [
        {
          key: 'cadastrar',
          label: 'Cadastrar Novo',
        },
        {
          key: 'listar',
          label: 'Listar Todos',
        },
      ],
    },
    {
      key: 'ferias',
      label: 'Férias',
    },
    {
      key: 'documentos',
      label: 'Documentos',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'dashboard':
        window.location.href = ROUTES.DASHBOARD;
        break;
      case 'cadastrar':
        window.location.href = ROUTES.COLABORADORES.CADASTRAR;
        break;
      case 'listar':
        window.location.href = ROUTES.COLABORADORES.LISTAR;
        break;
      case 'ferias':
        window.location.href = ROUTES.FERIAS.LISTAR;
        break;
      case 'documentos':
        window.location.href = ROUTES.DOCUMENTOS.LISTAR;
        break;
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
      >
        <div style={{ 
          height: 32, 
          margin: 16, 
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {!collapsed ? 'RH MATILHA' : 'RH'}
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Sistema de Gerenciamento de RH
          </Title>
          <Space>
            <Text>Bem-vindo ao RH Matilha</Text>
          </Space>
        </Header>
        
        <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
          <div style={{ padding: 24, background: '#fff', borderRadius: 8 }}>
            <Title level={2}>Dashboard</Title>
            <Text type="secondary">Visão geral do sistema de recursos humanos</Text>
            
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <Link href={ROUTES.COLABORADORES.TOTAL} style={{ textDecoration: 'none' }}>
                  <Card hoverable style={{ cursor: 'pointer' }}>
                    <Statistic
                      title="Total de Colaboradores"
                      value={dashboardData?.estatisticas.totalColaboradores || 0}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Link href={ROUTES.FERIAS.PENDENTES} style={{ textDecoration: 'none' }}>
                  <Card hoverable style={{ cursor: 'pointer' }}>
                    <Statistic
                      title="Férias Pendentes"
                      value={dashboardData?.estatisticas.feriasPendentes || 0}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Link href={ROUTES.DOCUMENTOS.VENCIDOS} style={{ textDecoration: 'none' }}>
                  <Card hoverable style={{ cursor: 'pointer' }}>
                    <Statistic
                      title="Documentos Vencidos"
                      value={dashboardData?.estatisticas.documentosVencidos || 0}
                      prefix={<FileTextOutlined />}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Link href={ROUTES.COLABORADORES.NOVOS} style={{ textDecoration: 'none' }}>
                  <Card hoverable style={{ cursor: 'pointer' }}>
                    <Statistic
                      title="Novos Cadastros"
                      value={dashboardData?.estatisticas.novosCadastros || 0}
                      prefix={<PlusOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Link>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} lg={12}>
                <Card title="Ações Rápidas" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Link href={ROUTES.COLABORADORES.CADASTRAR}>
                      <Button type="primary" icon={<PlusOutlined />} block>
                        Cadastrar Novo Colaborador
                      </Button>
                    </Link>
                    <Link href={ROUTES.COLABORADORES.LISTAR}>
                      <Button icon={<TeamOutlined />} block>
                        Ver Todos os Colaboradores
                      </Button>
                    </Link>
                    <Link href={ROUTES.FERIAS.LISTAR}>
                      <Button icon={<CalendarOutlined />} block>
                        Gerenciar Férias
                      </Button>
                    </Link>
                    <Link href={ROUTES.DOCUMENTOS.LISTAR}>
                      <Button icon={<FileTextOutlined />} block>
                        Gerenciar Documentos
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Atividades Recentes" style={{ height: '100%' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {dashboardData?.atividadesRecentes.map((atividade) => (
                      <div key={atividade.id}>
                        <Text strong>{atividade.nome}</Text>
                        <br />
                        <Text type="secondary">
                          Cadastro atualizado - {new Date(atividade.updatedAt).toLocaleDateString('pt-BR')}
                        </Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
