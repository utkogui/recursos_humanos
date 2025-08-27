'use client';

import { useState } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Button, 
  Card, 
  Row, 
  Col, 
  Select, 
  DatePicker, 
  message, 
  Breadcrumb,
  Typography,
  Space,
  Divider,
  Steps
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HomeOutlined, 
  IdcardOutlined,
  SaveOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import dayjs from 'dayjs';
import { ROUTES, API_ROUTES } from '@/lib/routes';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function CadastrarColaborador() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Informações Pessoais',
      content: 'personal',
    },
    {
      title: 'Contato e Endereço',
      content: 'contact',
    },
    {
      title: 'Informações Profissionais',
      content: 'professional',
    },
    {
      title: 'Documentos',
      content: 'documents',
    },
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Converter datas para formato ISO
      const formData = {
        ...values,
        dataNascimento: values.dataNascimento.format('YYYY-MM-DD'),
        dataAdmissao: values.dataAdmissao.format('YYYY-MM-DD'),
        salario: parseFloat(values.salario),
      };

      const response = await fetch(API_ROUTES.COLABORADORES.CRIAR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success('Colaborador cadastrado com sucesso!');
        form.resetFields();
        setCurrentStep(0);
        // Redirecionar para a lista de colaboradores
        window.location.href = ROUTES.COLABORADORES.LISTAR;
      } else {
        const errorData = await response.json();
        message.error(errorData.error || 'Erro ao cadastrar colaborador');
      }
    } catch (error) {
      console.error('Erro ao cadastrar colaborador:', error);
      message.error('Erro ao cadastrar colaborador');
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const breadcrumbItems = [
    { title: <Link href={ROUTES.DASHBOARD}>Dashboard</Link> },
    { title: <Link href={ROUTES.COLABORADORES.LISTAR}>Colaboradores</Link> },
    { title: 'Cadastrar Novo' }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nome"
                label="Nome Completo"
                rules={[{ required: true, message: 'Nome é obrigatório' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nome completo" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cpf"
                label="CPF"
                rules={[
                  { required: true, message: 'CPF é obrigatório' },
                  { pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: 'CPF inválido' }
                ]}
              >
                <Input placeholder="000.000.000-00" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dataNascimento"
                label="Data de Nascimento"
                rules={[{ required: true, message: 'Data de nascimento é obrigatória' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="genero"
                label="Gênero"
              >
                <Select placeholder="Selecione o gênero">
                  <Option value="masculino">Masculino</Option>
                  <Option value="feminino">Feminino</Option>
                  <Option value="outro">Outro</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="estadoCivil"
                label="Estado Civil"
              >
                <Select placeholder="Selecione o estado civil">
                  <Option value="solteiro">Solteiro(a)</Option>
                  <Option value="casado">Casado(a)</Option>
                  <Option value="divorciado">Divorciado(a)</Option>
                  <Option value="viuvo">Viúvo(a)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="nacionalidade"
                label="Nacionalidade"
              >
                <Input placeholder="Nacionalidade" />
              </Form.Item>
            </Col>
          </Row>
        );

      case 1:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  { required: true, message: 'E-mail é obrigatório' },
                  { type: 'email', message: 'E-mail inválido' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="email@exemplo.com" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="telefone"
                label="Telefone"
                rules={[{ required: true, message: 'Telefone é obrigatório' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="(11) 99999-9999" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="celular"
                label="Celular"
              >
                <Input prefix={<PhoneOutlined />} placeholder="(11) 88888-8888" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="telefoneEmergencia"
                label="Telefone de Emergência"
              >
                <Input prefix={<PhoneOutlined />} placeholder="(11) 77777-7777" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cep"
                label="CEP"
              >
                <Input placeholder="00000-000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="logradouro"
                label="Logradouro"
              >
                <Input placeholder="Rua, Avenida, etc." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="numero"
                label="Número"
              >
                <Input placeholder="Número" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="complemento"
                label="Complemento"
              >
                <Input placeholder="Apartamento, bloco, etc." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="bairro"
                label="Bairro"
              >
                <Input placeholder="Bairro" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cidade"
                label="Cidade"
              >
                <Input placeholder="Cidade" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="estado"
                label="Estado"
              >
                <Select placeholder="Selecione o estado">
                  <Option value="AC">Acre</Option>
                  <Option value="AL">Alagoas</Option>
                  <Option value="AP">Amapá</Option>
                  <Option value="AM">Amazonas</Option>
                  <Option value="BA">Bahia</Option>
                  <Option value="CE">Ceará</Option>
                  <Option value="DF">Distrito Federal</Option>
                  <Option value="ES">Espírito Santo</Option>
                  <Option value="GO">Goiás</Option>
                  <Option value="MA">Maranhão</Option>
                  <Option value="MT">Mato Grosso</Option>
                  <Option value="MS">Mato Grosso do Sul</Option>
                  <Option value="MG">Minas Gerais</Option>
                  <Option value="PA">Pará</Option>
                  <Option value="PB">Paraíba</Option>
                  <Option value="PR">Paraná</Option>
                  <Option value="PE">Pernambuco</Option>
                  <Option value="PI">Piauí</Option>
                  <Option value="RJ">Rio de Janeiro</Option>
                  <Option value="RN">Rio Grande do Norte</Option>
                  <Option value="RS">Rio Grande do Sul</Option>
                  <Option value="RO">Rondônia</Option>
                  <Option value="RR">Roraima</Option>
                  <Option value="SC">Santa Catarina</Option>
                  <Option value="SP">São Paulo</Option>
                  <Option value="SE">Sergipe</Option>
                  <Option value="TO">Tocantins</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        );

      case 2:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cargo"
                label="Cargo"
                rules={[{ required: true, message: 'Cargo é obrigatório' }]}
              >
                <Input placeholder="Cargo" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="departamento"
                label="Departamento"
                rules={[{ required: true, message: 'Departamento é obrigatório' }]}
              >
                <Select placeholder="Selecione o departamento">
                  <Option value="Tecnologia">Tecnologia</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="RH">RH</Option>
                  <Option value="Financeiro">Financeiro</Option>
                  <Option value="Vendas">Vendas</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dataAdmissao"
                label="Data de Admissão"
                rules={[{ required: true, message: 'Data de admissão é obrigatória' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="tipoContrato"
                label="Tipo de Contrato"
                rules={[{ required: true, message: 'Tipo de contrato é obrigatório' }]}
              >
                <Select placeholder="Selecione o tipo de contrato">
                  <Option value="CLT">CLT</Option>
                  <Option value="PJ">PJ</Option>
                  <Option value="Estagiario">Estagiário</Option>
                  <Option value="Temporario">Temporário</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="salario"
                label="Salário"
                rules={[{ required: true, message: 'Salário é obrigatório' }]}
              >
                <Input placeholder="0,00" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Status é obrigatório' }]}
              >
                <Select placeholder="Selecione o status">
                  <Option value="ativo">Ativo</Option>
                  <Option value="inativo">Inativo</Option>
                  <Option value="ferias">Férias</Option>
                  <Option value="licenca">Licença</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="observacoes"
                label="Observações"
              >
                <TextArea rows={3} placeholder="Observações sobre o colaborador..." />
              </Form.Item>
            </Col>
          </Row>
        );

      case 3:
        return (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="rg"
                label="RG"
              >
                <Input placeholder="RG" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="orgaoEmissor"
                label="Órgão Emissor"
              >
                <Input placeholder="SSP, DETRAN, etc." />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="pis"
                label="PIS"
              >
                <Input placeholder="PIS" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="ctps"
                label="CTPS"
              >
                <Input placeholder="Carteira de Trabalho" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="tituloEleitor"
                label="Título de Eleitor"
              >
                <Input placeholder="Título de Eleitor" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="reservista"
                label="Certificado de Reservista"
              >
                <Input placeholder="Certificado de Reservista" />
              </Form.Item>
            </Col>
          </Row>
        );

      default:
        return null;
    }
  };

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
          Cadastrar Novo Colaborador
        </Title>
        <Space>
          <Link href={ROUTES.COLABORADORES.LISTAR}>
            <Button icon={<ArrowLeftOutlined />}>
              Voltar à Lista
            </Button>
          </Link>
        </Space>
      </Header>
      
      <Content style={{ margin: '24px 16px', padding: 24, background: '#f5f5f5' }}>
        <Breadcrumb items={breadcrumbItems} style={{ marginBottom: 24 }} />
        
        <Card>
          <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
          
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              status: 'ativo',
              genero: 'masculino',
              estadoCivil: 'solteiro',
              nacionalidade: 'Brasileira',
              tipoContrato: 'CLT'
            }}
          >
            {renderStepContent()}
            
            <Divider />
            
            <div style={{ textAlign: 'right' }}>
              <Space>
                {currentStep > 0 && (
                  <Button onClick={prev}>
                    Anterior
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={next}>
                    Próximo
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    Cadastrar Colaborador
                  </Button>
                )}
              </Space>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
}
