import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Modal } from './components'
import { initContract } from './utils'

//@ts-ignore
window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <Modal>
        <App />
      </Modal>
      ,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
