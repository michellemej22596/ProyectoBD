import React from 'react';
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Home from './pages/Home'
import Grades from './pages/Grades'
import About from './pages/About'
import Logout from './pages/Logout'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'
import Cocina from './pages/Cocina'
import Reporte from './pages/Reporte'

const routes = {
  '/': {
    component: Home,
    requiresAuth: true
  }, 
  '/grades': {
    component: Grades,
    requiresAuth: true
  },   
  '/about': {
    component: About,
    requiresAuth: false
  },
  '/login': {
    component: Login,
    requiresAuth: false
  },
  '/logout': {
    component: Logout,
    requiresAuth: false
  },
  '/pedidos': { // Agrega la ruta para la pantalla de Pedido
    component: Pedidos,
    requiresAuth: false
  },
  '/cocina': { 
    component: Cocina,
    requiresAuth: false
  },
  '/Reporte': { 
      component: Reporte,
      requiresAuth: false
  }
  }


const Pages = ({ token, setToken }) => {
  const isLoggedIn = !!localStorage.getItem('access_token')
  const path = window.location.hash.substring(1)

  const [page, setPage] = useState(path || '/')

  useEffect(() => {
    if (path) {
      setPage(path)
    }
  }, [path])

  console.log('path', path)
  console.log('page', page)
  console.log('token', token)

  let CurrentPage = () => <h1>404</h1>

  //IMPORTANTE PARA EL LOGIN, ESTA COMENTADO PARA HACER PRUEBAS!!!
  //if (routes[page] && routes[page].requiresAuth && !token) {
  //  return <div><h1>Unauthorized</h1><a href='/#/login' onClick={() => setPage('/login')}>Please login</a></div>
  //}

  CurrentPage = routes[page].component


//Agregar paginas dentro de los li
 
return (
    <div>
      <ul style={{ position: 'fixed', top: 0, left: 0, width: '100%', listStyle: 'none', display: 'flex', gap: '5px' }}>
        <li className={page === '/' ? 'active' : ''}> 
          <a href="/" onClick={() => setPage('/home')}>Home</a>
        </li>
        <li className={page === '/pedidos' ? 'active' : ''}>
        <a href="#/pedidos" onClick={() => setPage('/pedidos')}>Pedidos</a>
      </li>
      <li className={page === '/cocina' ? 'active' : ''}>
        <a href="#/cocina" onClick={() => setPage('/cocina')}>Cocina</a>
      </li>
      <li className={page === '/reporte' ? 'active' : ''}>
        <a href="#/reporte" onClick={() => setPage('/reporte')}>Reporte</a>
      </li>
        {
          isLoggedIn ? (
            <li className={page === '/logout' ? 'active' : ''}> 
              <a href="#/logout" onClick={() => setPage('/logout')}>Logout</a>
            </li>
          ) : (
            <li className={page === '/login' ? 'active' : ''}> 
              <a href="#/login" onClick={() => setPage('/login')}>Login</a>
            </li>
          )
        }
      </ul>
      <CurrentPage token={token} setToken={setToken} navigate={setPage} />
    </div>
  )
}


Pages.propTypes = {
  token: PropTypes.string,
  setToken: PropTypes.func
}

export default Pages