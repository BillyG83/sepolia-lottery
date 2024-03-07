import lottery from './lottery'
import { useEffect, useState } from "react";
import web3 from './web3';

const App = () => {
  const [balance, setBalance] = useState('')
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])

  const getBalance = async () => {
    try {
      const result = await web3.eth.getBalance(lottery.options.address)
      return result
    } catch(error){
      console.error(error)
    }
  }
  
  const getManager = async () => {
    try {
      const result = await lottery.methods.manager().call()
      return result
    } catch(error){
      console.error(error)
    }
  }

  const getPlayers = async () => {
    try {
      const result = await lottery.methods.getPlayers().call()
      return result
    } catch(error){
      console.error(error)
    }
  }

  useEffect(() => {
    getBalance().then(res => setBalance(res))
    getManager().then(res => setManager(res))
    getPlayers().then(res => setPlayers(res))
  }, [])

  return(
    <div>
      <h1>Lottery</h1>
      <p>manager: {manager}</p>
      <p>Number of player this round: {players.length} with a prize pool of: {balance ? web3.utils.fromWei(balance, 'ether') : 'nada'}</p>
    </div>
  )
}

export default App;
