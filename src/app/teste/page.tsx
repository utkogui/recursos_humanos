'use client';

import { useState, useEffect } from 'react';

export default function TestePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Testando API...');
      const response = await fetch('/api/dashboard');
      console.log('Status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Dados recebidos:', result);
        setData(result);
      } else {
        setError(`Erro ${response.status}`);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError(`Erro de conexão: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <div>
      <h1>Página de Teste</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={fetchData}>Testar Novamente</button>
    </div>
  );
}
