import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx'
import { initContract } from './utils.ts'

//@ts-ignore
window.nearInitPromise = initContract()
  .then(() => {
    ReactDOM.render(
      <App />,
      document.querySelector('#root')
    )
  })
  .catch(console.error)
