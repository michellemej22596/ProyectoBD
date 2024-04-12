// En App.js
import React, { useState } from 'react';
import Pages from './pages';
import './styles/App.css'

function App() {
  const [token, setToken] = useState(null);

  return <Pages token={token} setToken={setToken} />;
}

export default App;
