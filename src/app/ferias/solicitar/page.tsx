'use client';

import { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  message, 
  Breadcrumb,
  Typography,
  Row,
  Col,
  Divider
} from 'antd';
import { 
  CalendarOutlined, 
  UserOutlined, 
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { ROUTES, API_ROUTES } from '@/lib/routes';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
}

export default function SolicitarFerias() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchColaboradores();
  }, []);

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

  const handleSubmit = async (values: any) => {
    setLoading(true);
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
        form.resetFields();
        // Redirecionar para a lista de férias
        window.location.href = ROUTES.FERIAS.LISTAR;
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Erro ao criar solicitação de férias');
      }
    } catch (error) {
      console.error('Erro ao criar solicitação de férias:', error);
      message.error('Erro ao criar solicitação de férias');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { title: <Link href={ROUTES.DASHBOARD}>Dashboard</Link> },
    { title: <Link href={ROUTES.FERIAS.LISTAR}>Férias</Link> },
    { title: 'Solicitar Férias' }
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
          Solicitar Férias
        </Title>
        <Space>
          <Link href={ROUTES.FERIAS.LISTAR}>
            <Button icon={<ArrowLeftOutlined />}>
              Voltar às Férias
            </Button>
          </Link>
        </Space>
      </Header>
      
      <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 24 }} />
        
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              tipoFerias: 'ferias_anuais'
            }}
          >
            <Title level={4}>
              <UserOutlined /> Informações do Colaborador
            </Title>
            
            <Form.Item
              name="colaboradorId"
              label="Colaborador"
              rules={[{ required: true, message: 'Selecione um colaborador' }]}
            >
              <Select placeholder="Selecione o colaborador">
                {colaboradores.map(colab => (
                  <Option key={colab.id} value={colab.id}>
                    {colab.nome} - {colab.cargo} ({colab.departamento})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Divider />

            <Title level={4}>
              <CalendarOutlined /> Período das Férias
            </Title>
            
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="dataInicio"
                  label="Data de Início"
                  rules={[{ required: true, message: 'Selecione a data de início' }]}
                >
                  <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
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
              <TextArea rows={4} placeholder="Descreva o motivo das férias, observações especiais..." />
            </Form.Item>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Solicitar Férias
                </Button>
                <Button 
                  onClick={() => form.resetFields()}
                  size="large"
                >
                  Limpar Formulário
                </Button>
                <Link href={ROUTES.FERIAS.LISTAR}>
                  <Button size="large">
                    Cancelar
                  </Button>
                </Link>
              </Space>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
