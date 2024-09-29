import { useState } from 'react'
import { checkMatch } from './utils/utils'
import './App.css'

function App() {
  const [cidrs, setCidrs] = useState({cidr_1: '', cidr_2: ''})

  // state in the check here can be;
  //    idle: we aren't checking anything
  //    error: we checked and found one or both of the cidr input are not valid
  //    okay: we checked and the cidrs the user entered were okay
  const [check, setCheck] = useState({state: 'idle', message: ''})

  function updateCidr(e){
    setCheck({state:'idle', message: ''})
    setCidrs(cidrs => ({...cidrs, [e.target.id]: e.target.value}))
  }

  function handleSubmit(e){
    e.preventDefault()
    setCheck(checkMatch(cidrs))
  }

  return (
    <div id='app'>
      <div className='outer-container'>
        <h2>Check if CIDR blocks overlap</h2>
        <div className='inner-container'>
          <form onSubmit={handleSubmit}>
            <div className='inputs'>
              <input id='cidr_1' type="text" value={cidrs['cidr_1']} placeholder='Enter cidr 1' onChange={updateCidr}/>
              <input id='cidr_2' type="text" value={cidrs['cidr_2']} placeholder='Enter cidr 2' onChange={updateCidr}/>
            </div>
            <button style={{cursor: 'pointer'}}>Check</button>
          </form>
          <div id='message' className={check.state}>{check.message}</div>
        </div>
      </div>
    </div>
  )
}


export default App
