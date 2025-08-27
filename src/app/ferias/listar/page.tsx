'use client';

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Calendar, 
  Card, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker,
  message, 
  Breadcrumb, 
  Typography, 
  Row, 
  Col,
  Table,
  Dropdown,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ROUTES, API_ROUTES } from '@/lib/routes';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Ferias {
  id: number;
  colaboradorId: number;
  dataInicio: string;
  dataFim: string;
  tipoFerias: string;
  status: string;
  observacoes?: string;
  aprovadoPor?: string;
  dataAprovacao?: string;
  colaborador: {
    id: number;
    nome: string;
    cargo: string;
    departamento: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
}

export default function ListarFerias() {
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [form] = Form.useForm();

  // Buscar férias da API
  const fetchFerias = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ROUTES.FERIAS.LISTAR);
      if (response.ok) {
        const data = await response.json();
        setFerias(data.ferias);
      } else {
        message.error('Erro ao buscar férias');
      }
    } catch (error) {
      console.error('Erro ao buscar férias:', error);
      message.error('Erro ao buscar férias');
    } finally {
      setLoading(false);
    }
  };

  // Buscar colaboradores para o formulário
  const fetchColaboradores = async () => {
    try {
      const response = await fetch(API_ROUTES.COLABORADORES.LISTAR);
      if (response.ok) {
        const data = await response.json();
        setColaboradores(data.colaboradores);
      }
    } catch (error) {
      console.error('Erro ao buscar colaboradores:', error);
    }
  };

  useEffect(() => {
    fetchFerias();
    fetchColaboradores();
  }, []);

  // Função para mostrar modal
  const showModal = (date?: dayjs.Dayjs) => {
    setSelectedDate(date || null);
    setModalVisible(true);
    if (date) {
      form.setFieldsValue({
        dataInicio: date,
        dataFim: date.add(1, 'day')
      });
    }
  };

  // Função para criar solicitação de férias
  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(API_ROUTES.FERIAS.CRIAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          dataInicio: values.dataInicio.format('YYYY-MM-DD'),
          dataFim: values.dataFim.format('YYYY-MM-DD'),
        }),
      });

      if (response.ok) {
        message.success('Solicitação de férias criada com sucesso!');
        setModalVisible(false);
        form.resetFields();
        fetchFerias();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Erro ao criar solicitação de férias');
      }
    } catch (error) {
      console.error('Erro ao criar solicitação de férias:', error);
      message.error('Erro ao criar solicitação de férias');
    }
  };

  // Função para excluir férias
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir esta solicitação de férias?',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          const response = await fetch(API_ROUTES.FERIAS.EXCLUIR(id), {
            method: 'DELETE'
          });
          
          if (response.ok) {
            message.success('Solicitação de férias excluída com sucesso');
            fetchFerias();
          } else {
            message.error('Erro ao excluir solicitação de férias');
          }
        } catch (error) {
          console.error('Erro ao excluir solicitação de férias:', error);
          message.error('Erro ao excluir solicitação de férias');
        }
      }
    });
  };

  // Função para aprovar férias
  const handleAprovar = async (id: number) => {
    try {
      const response = await fetch(API_ROUTES.FERIAS.APROVAR(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'aprovado',
          aprovadoPor: 'Sistema',
          dataAprovacao: new Date().toISOString()
        }),
      });

      if (response.ok) {
        message.success('Férias aprovadas com sucesso!');
        fetchFerias();
      } else {
        message.error('Erro ao aprovar férias');
      }
    } catch (error) {
      console.error('Erro ao aprovar férias:', error);
      message.error('Erro ao aprovar férias');
    }
  };

  // Função para reprovar férias
  const handleReprovar = async (id: number) => {
    try {
      const response = await fetch(API_ROUTES.FERIAS.REPROVAR(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'reprovado'
        }),
      });

      if (response.ok) {
        message.success('Férias reprovadas');
        fetchFerias();
      } else {
        message.error('Erro ao reprovar férias');
      }
    } catch (error) {
      console.error('Erro ao reprovar férias:', error);
      message.error('Erro ao reprovar férias');
    }
  };

  // Função para renderizar células do calendário
  const dateCellRender = (value: dayjs.Dayjs) => {
    const feriasDoDia = ferias.filter(feriasItem => {
      const inicio = dayjs(feriasItem.dataInicio);
      const fim = dayjs(feriasItem.dataFim);
      const currentDate = value;
      return currentDate.isSame(inicio, 'day') || 
             currentDate.isSame(fim, 'day') ||
             (currentDate.isAfter(inicio, 'day') && currentDate.isBefore(fim, 'day'));
    });

    return (
      <div style={{ height: '100%', padding: '2px' }}>
        {feriasDoDia.map(feriasItem => (
          <div
            key={feriasItem.id}
            style={{
              background: feriasItem.status === 'aprovado' ? '#52c41a' : 
                         feriasItem.status === 'pendente' ? '#faad14' : '#ff4d4f',
              color: 'white',
              padding: '2px 4px',
              borderRadius: '2px',
              fontSize: '10px',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={`${feriasItem.colaborador.nome} - ${feriasItem.status}`}
          >
            {feriasItem.colaborador.nome.split(' ')[0]}
          </div>
        ))}
      </div>
    );
  };

  // Configuração das colunas da tabela
  const columns = [
    {
      title: 'Colaborador',
      key: 'colaborador',
      render: (record: Ferias) => (
        <div>
          <Text strong>{record.colaborador.nome}</Text>
          <br />
          <Text type="secondary">{record.colaborador.cargo} - {record.colaborador.departamento}</Text>
        </div>
      ),
    },
    {
      title: 'Período',
      key: 'periodo',
      render: (record: Ferias) => (
        <div>
          <Text>{dayjs(record.dataInicio).format('DD/MM/YYYY')} a {dayjs(record.dataFim).format('DD/MM/YYYY')}</Text>
          <br />
          <Text type="secondary">
            {dayjs(record.dataFim).diff(dayjs(record.dataInicio), 'day') + 1} dias
          </Text>
        </div>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoFerias',
      key: 'tipoFerias',
      render: (text: string) => (
        <Tag color="blue">
          {text === 'ferias_anuais' ? 'Férias Anuais' : 
           text === 'ferias_compensatorias' ? 'Férias Compensatórias' : 
           text === 'ferias_especiais' ? 'Férias Especiais' : text}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          aprovado: { color: 'green', text: 'Aprovado', icon: <CheckCircleOutlined /> },
          pendente: { color: 'orange', text: 'Pendente', icon: <ClockCircleOutlined /> },
          reprovado: { color: 'red', text: 'Reprovado', icon: <CloseCircleOutlined /> }
        };
        
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Observações',
      dataIndex: 'observacoes',
      key: 'observacoes',
      render: (text: string) => <Text>{text || '-'}</Text>,
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (record: Ferias) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'visualizar',
                icon: <EyeOutlined />,
                label: 'Visualizar',
                onClick: () => window.open(ROUTES.FERIAS.VISUALIZAR(record.id), '_blank')
              },
              {
                key: 'editar',
                icon: <EditOutlined />,
                label: 'Editar',
                onClick: () => window.open(ROUTES.FERIAS.EDITAR(record.id), '_blank')
              },
              ...(record.status === 'pendente' ? [
                {
                  key: 'aprovar',
                  icon: <CheckCircleOutlined />,
                  label: 'Aprovar',
                  onClick: () => handleAprovar(record.id)
                },
                {
                  key: 'reprovar',
                  icon: <CloseCircleOutlined />,
                  label: 'Reprovar',
                  onClick: () => handleReprovar(record.id)
                }
              ] : []),
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
    { title: <Link href={ROUTES.FERIAS.LISTAR}>Férias</Link> },
    { title: 'Listar Todas' }
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
          Listagem de Férias
        </Title>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Nova Solicitação
          </Button>
          <Link href={ROUTES.FERIAS.LISTAR}>
            <Button>
              Voltar às Férias
            </Button>
          </Link>
        </Space>
      </Header>
      
      <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 24 }} />
        
        <Row gutter={[24, 24]}>
          {/* Calendário */}
          <Col xs={24} lg={16}>
            <Card title="Calendário de Férias" extra={
              <Space>
                <Tag color="green">Aprovado</Tag>
                <Tag color="orange">Pendente</Tag>
                <Tag color="red">Reprovado</Tag>
              </Space>
            }>
              <Calendar
                dateCellRender={dateCellRender}
                onSelect={showModal}
                fullscreen={true}
              />
            </Card>
          </Col>

          {/* Lista de Solicitações */}
          <Col xs={24} lg={8}>
            <Card title="Solicitações de Férias" extra={
              <Button type="link" size="small">
                Ver Todas
              </Button>
            }>
              <Table
                columns={columns}
                dataSource={ferias}
                rowKey="id"
                loading={loading}
                pagination={false}
                size="small"
                scroll={{ y: 400 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Modal para nova solicitação */}
        <Modal
          title="Nova Solicitação de Férias"
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="colaboradorId"
              label="Colaborador"
              rules={[{ required: true, message: 'Selecione um colaborador' }]}
            >
              <Select placeholder="Selecione o colaborador">
                {colaboradores.map(colab => (
                  <Option key={colab.id} value={colab.id}>
                    {colab.nome} - {colab.cargo}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dataInicio"
                  label="Data de Início"
                  rules={[{ required: true, message: 'Selecione a data de início' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dataFim"
                  label="Data de Fim"
                  rules={[{ required: true, message: 'Selecione a data de fim' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="tipoFerias"
              label="Tipo de Férias"
              rules={[{ required: true, message: 'Selecione o tipo de férias' }]}
            >
              <Select placeholder="Selecione o tipo">
                <Option value="ferias_anuais">Férias Anuais</Option>
                <Option value="ferias_compensatorias">Férias Compensatórias</Option>
                <Option value="ferias_especiais">Férias Especiais</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="observacoes"
              label="Observações"
            >
              <TextArea rows={3} placeholder="Observações sobre a solicitação..." />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Solicitar Férias
                </Button>
                <Button onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                }}>
                  Cancelar
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
