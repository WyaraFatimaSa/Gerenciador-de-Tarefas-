import React, { useState, useEffect } from 'react';

function App() {
  const [lista, setLista] = useState([]);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/tasks')
      .then(res => res.json())
      .then(data => setLista(data));
  }, []);

  const adicionar = () => {
    if (!texto) return;
    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: texto }),
    })
      .then(res => res.json())
      .then(nova => {
        setLista([...lista, nova]);
        setTexto('');
      });
  };

  const mudarStatus = (item) => {
    fetch(`http://localhost:5000/tasks/${item._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: item.title, completed: !item.completed }),
    })
      .then(res => res.json())
      .then(atualizada => {
        setLista(lista.map(l => (l._id === atualizada._id ? atualizada : l)));
      });
  };

  const apagar = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setLista(lista.filter(l => l._id !== id));
    });
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
      <h1>Gerenciador de Tarefas</h1>
      <input
        type="text"
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escreve aí..."
      />
      <button onClick={adicionar}>Adicionar</button>

      <ul>
        {lista.map(item => (
          <li key={item._id} style={{ marginTop: '10px' }}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => mudarStatus(item)}
            />
            <span style={{ textDecoration: item.completed ? 'line-through' : '', marginLeft: '8px' }}>
              {item.title}
            </span>
            <button
              onClick={() => apagar(item._id)}
              style={{ marginLeft: '10px' }}
            >
              Apagar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
