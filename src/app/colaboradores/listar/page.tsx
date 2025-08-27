'use client';

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Table, 
  Input, 
  Button, 
  Space, 
  Card, 
  Tag, 
  Dropdown, 
  message, 
  Modal,
  Breadcrumb,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  MoreOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ROUTES, API_ROUTES } from '@/lib/routes';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Colaborador {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  tipoContrato: string;
  salario: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ListarColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [departamentoFilter, setDepartamentoFilter] = useState('todos');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Buscar colaboradores da API
  const fetchColaboradores = async (page = 1, search = '', status = '', departamento = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(status && status !== 'todos' && { status }),
        ...(departamento && departamento !== 'todos' && { departamento })
      });

      const response = await fetch(`${API_ROUTES.COLABORADORES.LISTAR}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setColaboradores(data.colaboradores);
        setPagination(data.pagination);
      } else {
        message.error('Erro ao buscar colaboradores');
      }
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
      message.error('Erro ao buscar colaboradores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

  // Função para excluir colaborador
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este colaborador? Esta ação não pode ser desfeita.',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const response = await fetch(API_ROUTES.COLABORADORES.EXCLUIR(id), {
            method: 'DELETE'
          });
          
          if (response.ok) {
            message.success('Colaborador excluído com sucesso');
            fetchColaboradores(pagination.page, searchText, statusFilter, departamentoFilter);
          } else {
            message.error('Erro ao excluir colaborador');
          }
        } catch (error) {
          console.error('Erro ao excluir colaborador:', error);
          message.error('Erro ao excluir colaborador');
        }
      }
    });
  };

  // Função para buscar
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchColaboradores(1, value, statusFilter, departamentoFilter);
  };

  // Função para filtrar por status
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchColaboradores(1, searchText, value, departamentoFilter);
  };

  // Função para filtrar por departamento
  const handleDepartamentoFilter = (value: string) => {
    setDepartamentoFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchColaboradores(1, searchText, statusFilter, value);
  };

  // Função para mudar página
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchColaboradores(page, searchText, statusFilter, departamentoFilter);
  };

  // Função para recarregar dados
  const handleReload = () => {
    fetchColaboradores(pagination.page, searchText, statusFilter, departamentoFilter);
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      render: (text: string, record: Colaborador) => (
        <Link href={ROUTES.COLABORADORES.VISUALIZAR(record.id)}>
          <Text strong style={{ color: '#1890ff', cursor: 'pointer' }}>
            {text}
          </Text>
        </Link>
      ),
      sorter: (a: Colaborador, b: Colaborador) => a.nome.localeCompare(b.nome),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      render: (text: string) => <Text code>{text}</Text>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Cargo',
      dataIndex: 'cargo',
      key: 'cargo',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Departamento',
      dataIndex: 'departamento',
      key: 'departamento',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Data Admissão',
      dataIndex: 'dataAdmissao',
      key: 'dataAdmissao',
      render: (text: string) => <Text>{dayjs(text).format('DD/MM/YYYY')}</Text>,
      sorter: (a: Colaborador, b: Colaborador) => dayjs(a.dataAdmissao).unix() - dayjs(b.dataAdmissao).unix(),
    },
    {
      title: 'Tipo Contrato',
      dataIndex: 'tipoContrato',
      key: 'tipoContrato',
      render: (text: string) => (
        <Tag color={text === 'CLT' ? 'green' : text === 'PJ' ? 'blue' : 'orange'}>
          {text.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Salário',
      dataIndex: 'salario',
      key: 'salario',
      render: (value: number) => (
        <Text strong>
          {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </Text>
      ),
      sorter: (a: Colaborador, b: Colaborador) => a.salario - b.salario,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={text === 'ativo' ? 'green' : 'red'}>
          {text === 'ativo' ? 'Ativo' : 'Inativo'}
        </Tag>
      ),
      filters: [
        { text: 'Ativo', value: 'ativo' },
        { text: 'Inativo', value: 'inativo' },
      ],
      onFilter: (value: string, record: Colaborador) => record.status === value,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (record: Colaborador) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'visualizar',
                icon: <EyeOutlined />,
                label: 'Visualizar',
                onClick: () => window.open(ROUTES.COLABORADORES.VISUALIZAR(record.id), '_blank')
              },
              {
                key: 'editar',
                icon: <EditOutlined />,
                label: 'Editar',
                onClick: () => window.open(ROUTES.COLABORADORES.EDITAR(record.id), '_blank')
              },
              {
                key: 'excluir',
                icon: <DeleteOutlined />,
                label: 'Excluir',
                danger: true,
                onClick: () => handleDelete(record.id)
              }
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const breadcrumbItems = [
    { title: <Link href={ROUTES.DASHBOARD}>Dashboard</Link> },
    { title: 'Colaboradores' }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        padding: '0 24px', 
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          Gerenciamento de Colaboradores
        </Title>
        <Space>
          <Link href={ROUTES.COLABORADORES.CADASTRAR}>
            <Button type="primary" icon={<PlusOutlined />}>
              Novo Colaborador
            </Button>
          </Link>
          <Link href={ROUTES.DASHBOARD}>
            <Button>
              Voltar ao Dashboard
            </Button>
          </Link>
        </Space>
      </Header>
      
      <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 24 }} />
        
        <Card>
          {/* Filtros e Busca */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Search
                placeholder="Buscar por nome, email ou cargo"
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Filtrar por status"
                value={statusFilter}
                onChange={handleStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="todos">Todos os Status</Option>
                <Option value="ativo">Ativo</Option>
                <Option value="inativo">Inativo</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Filtrar por departamento"
                value={departamentoFilter}
                onChange={handleDepartamentoFilter}
                style={{ width: '100%' }}
              >
                <Option value="todos">Todos os Departamentos</Option>
                <Option value="Tecnologia">Tecnologia</Option>
                <Option value="Design">Design</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="RH">RH</Option>
                <Option value="Financeiro">Financeiro</Option>
                <Option value="Vendas">Vendas</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={handleReload}
                style={{ width: '100%' }}
              >
                Recarregar
              </Button>
            </Col>
          </Row>

          {/* Tabela */}
          <Table
            columns={columns}
            dataSource={colaboradores}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} colaboradores`,
              onChange: handlePageChange,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Content>
    </Layout>
  );
}
