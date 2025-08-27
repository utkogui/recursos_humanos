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
  Tooltip,
  Progress,
  Alert
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  MoreOutlined,
  FilterOutlined,
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ROUTES, API_ROUTES } from '@/lib/routes';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface Documento {
  id: number;
  nome: string;
  colaboradorId: number;
  tipo: string;
  categoria: string;
  dataUpload: string;
  dataVencimento?: string;
  status: string;
  tamanho?: string;
  caminhoArquivo?: string;
  observacoes?: string;
  colaborador: {
    id: number;
    nome: string;
    cargo: string;
    departamento: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function ListarDocumentos() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Buscar documentos da API
  const fetchDocumentos = async (page = 1, search = '', tipo = '', status = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(tipo && tipo !== 'todos' && { tipo }),
        ...(status && status !== 'todos' && { status })
      });

      const response = await fetch(`${API_ROUTES.DOCUMENTOS.LISTAR}?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDocumentos(data.documentos);
        setPagination(data.pagination);
      } else {
        message.error('Erro ao buscar documentos');
      }
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
      message.error('Erro ao buscar documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  // Função para excluir documento
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const response = await fetch(API_ROUTES.DOCUMENTOS.EXCLUIR(id), {
            method: 'DELETE'
          });
          
          if (response.ok) {
            message.success('Documento excluído com sucesso');
            fetchDocumentos(pagination.page, searchText, tipoFilter, statusFilter);
          } else {
            message.error('Erro ao excluir documento');
          }
        } catch (error) {
          console.error('Erro ao excluir documento:', error);
          message.error('Erro ao excluir documento');
        }
      }
    });
  };

  // Função para buscar
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDocumentos(1, value, tipoFilter, statusFilter);
  };

  // Função para filtrar por tipo
  const handleTipoFilter = (value: string) => {
    setTipoFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDocumentos(1, searchText, value, statusFilter);
  };

  // Função para filtrar por status
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchDocumentos(1, searchText, tipoFilter, value);
  };

  // Função para mudar página
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    fetchDocumentos(page, searchText, tipoFilter, statusFilter);
  };

  // Função para recarregar dados
  const handleReload = () => {
    fetchDocumentos(pagination.page, searchText, tipoFilter, statusFilter);
  };

  // Função para obter cor do status
  const getStatusColor = (status: string, dataVencimento?: string) => {
    if (status === 'vencido') return '#ff4d4f';
    if (status === 'valido' && dataVencimento) {
      const diasParaVencimento = dayjs(dataVencimento).diff(dayjs(), 'day');
      if (diasParaVencimento <= 7) return '#faad14';
      if (diasParaVencimento <= 30) return '#1890ff';
    }
    return '#52c41a';
  };

  // Função para obter tag de status
  const getStatusTag = (status: string, dataVencimento?: string) => {
    if (status === 'vencido') {
      return <Tag color="red" icon={<ExclamationCircleOutlined />}>Vencido</Tag>;
    }
    
    if (status === 'valido' && dataVencimento) {
      const diasParaVencimento = dayjs(dataVencimento).diff(dayjs(), 'day');
      if (diasParaVencimento <= 7) {
        return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Vence em {diasParaVencimento} dias</Tag>;
      }
      if (diasParaVencimento <= 30) {
        return <Tag color="blue">Vence em {diasParaVencimento} dias</Tag>;
      }
    }
    
    return <Tag color="green">Válido</Tag>;
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      title: 'Documento',
      key: 'documento',
      render: (record: Documento) => (
        <div>
          <Text strong>{record.nome}</Text>
          <br />
          <Text type="secondary">
            {record.colaborador.nome} - {record.colaborador.cargo}
          </Text>
        </div>
      ),
      sorter: (a: Documento, b: Documento) => a.nome.localeCompare(b.nome),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (text: string) => (
        <Tag color="blue">
          {text === 'contrato' ? 'Contrato' : 
           text === 'identidade' ? 'Identidade' : 
           text === 'militar' ? 'Militar' : 
           text === 'academico' ? 'Acadêmico' : 
           text === 'saude' ? 'Saúde' : text}
        </Tag>
      ),
      filters: [
        { text: 'Contrato', value: 'contrato' },
        { text: 'Identidade', value: 'identidade' },
        { text: 'Militar', value: 'militar' },
        { text: 'Acadêmico', value: 'academico' },
        { text: 'Saúde', value: 'saude' },
      ],
      onFilter: (value: string, record: Documento) => record.tipo === value,
    },
    {
      title: 'Categoria',
      dataIndex: 'categoria',
      key: 'categoria',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Data Upload',
      dataIndex: 'dataUpload',
      key: 'dataUpload',
      render: (text: string) => <Text>{dayjs(text).format('DD/MM/YYYY')}</Text>,
      sorter: (a: Documento, b: Documento) => dayjs(a.dataUpload).unix() - dayjs(b.dataUpload).unix(),
    },
    {
      title: 'Vencimento',
      key: 'vencimento',
      render: (record: Documento) => (
        <div>
          {record.dataVencimento ? (
            <>
              <div>{dayjs(record.dataVencimento).format('DD/MM/YYYY')}</div>
              {record.dataVencimento && (
                <Progress
                  percent={50}
                  size="small"
                  strokeColor={getStatusColor(record.status, record.dataVencimento)}
                  showInfo={false}
                />
              )}
            </>
          ) : (
            <Text type="secondary">Sem vencimento</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Documento) => getStatusTag(record.status, record.dataVencimento),
    },
    {
      title: 'Tamanho',
      dataIndex: 'tamanho',
      key: 'tamanho',
      render: (text: string) => <Text>{text || '-'}</Text>,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (record: Documento) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'visualizar',
                icon: <EyeOutlined />,
                label: 'Visualizar',
                onClick: () => window.open(ROUTES.DOCUMENTOS.VISUALIZAR(record.id), '_blank')
              },
              {
                key: 'download',
                icon: <DownloadOutlined />,
                label: 'Download',
                onClick: () => window.open(API_ROUTES.DOCUMENTOS.DOWNLOAD(record.id), '_blank')
              },
              {
                key: 'editar',
                icon: <EditOutlined />,
                label: 'Editar',
                onClick: () => window.open(ROUTES.DOCUMENTOS.EDITAR(record.id), '_blank')
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

  // Documentos vencidos e próximos do vencimento
  const documentosVencidos = documentos.filter(doc => 
    doc.dataVencimento && dayjs(doc.dataVencimento).isBefore(dayjs())
  );

  const documentosProximosVencimento = documentos.filter(doc => 
    doc.dataVencimento && 
    dayjs(doc.dataVencimento).isAfter(dayjs()) && 
    dayjs(doc.dataVencimento).diff(dayjs(), 'day') <= 30
  );

  const breadcrumbItems = [
    { title: <Link href={ROUTES.DASHBOARD}>Dashboard</Link> },
    { title: <Link href={ROUTES.DOCUMENTOS.LISTAR}>Documentos</Link> },
    { title: 'Listar Todos' }
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
          Listagem de Documentos
        </Title>
        <Space>
          <Link href={ROUTES.DOCUMENTOS.UPLOAD}>
            <Button type="primary" icon={<UploadOutlined />}>
              Upload de Documento
            </Button>
          </Link>
          <Link href={ROUTES.DOCUMENTOS.LISTAR}>
            <Button>
              Voltar aos Documentos
            </Button>
          </Link>
        </Space>
      </Header>
      
      <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 24 }} />
        
        {/* Alertas */}
        {(documentosVencidos.length > 0 || documentosProximosVencimento.length > 0) && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            {documentosVencidos.length > 0 && (
              <Col xs={24} md={12}>
                <Alert
                  message={`${documentosVencidos.length} documento(s) vencido(s)`}
                  description="Existem documentos que precisam ser renovados urgentemente."
                  type="error"
                  showIcon
                  action={
                    <Button size="small" danger>
                      Ver Documentos
                    </Button>
                  }
                />
              </Col>
            )}
            {documentosProximosVencimento.length > 0 && (
              <Col xs={24} md={12}>
                <Alert
                  message={`${documentosProximosVencimento.length} documento(s) próximo(s) do vencimento`}
                  description="Existem documentos que vencem nos próximos 30 dias."
                  type="warning"
                  showIcon
                  action={
                    <Button size="small">
                      Ver Documentos
                    </Button>
                  }
                />
              </Col>
            )}
          </Row>
        )}
        
        <Card>
          {/* Filtros e Busca */}
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Search
                placeholder="Buscar por nome, colaborador ou categoria"
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Filtrar por tipo"
                value={tipoFilter}
                onChange={handleTipoFilter}
                style={{ width: '100%' }}
              >
                <Option value="todos">Todos os Tipos</Option>
                <Option value="contrato">Contratos</Option>
                <Option value="identidade">Identidade</Option>
                <Option value="militar">Militar</Option>
                <Option value="academico">Acadêmico</Option>
                <Option value="saude">Saúde</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="Filtrar por status"
                value={statusFilter}
                onChange={handleStatusFilter}
                style={{ width: '100%' }}
              >
                <Option value="todos">Todos os Status</Option>
                <Option value="valido">Válido</Option>
                <Option value="vencido">Vencido</Option>
                <Option value="pendente">Pendente</Option>
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
            dataSource={documentos}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} de ${total} documentos`,
              onChange: handlePageChange,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Content>
    </Layout>
  );
}
