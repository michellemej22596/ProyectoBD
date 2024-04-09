import { useEffect, useState } from 'react'
import '/styles/App.css'
import Login from '/pages/Login'
import Pages from './router'

function App() {
  const [ token, setToken ] = useState(
    localStorage.getItem('access_token') || null
  )

  useEffect(() => {
    if (token) {
      localStorage.setItem('access_token', token)
    }
  }, [token])

  return (
    <div>
      <Pages token={token} setToken={setToken} />
    </div>
  )
}

export default App