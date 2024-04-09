import React from 'react';
import PropTypes from 'prop-types'

import '../styles/Button.css'

const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="button">
      {text}
    </button>
  )
}

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func
}

export default Button