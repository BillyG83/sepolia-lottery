import lottery from './lottery'
import { useEffect, useState } from "react";
import web3 from './web3';
import './App.css'

const App = () => {
  const [balance, setBalance] = useState('')
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  const isValidEthereumAddress = (address) => ethereumAddressRegex.test(address);
  const addressInput = 'address-input'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const input = form[0]

    if (!isValidEthereumAddress(input.value)) {
      alert(`Sorry! ${input.value} does not appear to be a Ethereum wallet address`)
      return
    }

    try {
      setIsFetching(true)
      await lottery.methods.enter().send({
        from: input.value,
        value: web3.utils.toWei(0.1, 'ether')
      })
    } catch (error) {
      alert(`Oh dear! You were unable to enter with wallet address: ${input.value}`)
      console.error(error)
    }
    setIsFetching(false)
    form.reset()
  }

  useEffect(() => {
    getBalance().then(res => setBalance(res))
    getManager().then(res => setManager(res))
    getPlayers().then(res => setPlayers(res))
  }, [])

  return(
    <main>
      <div className='dapp'>
        <header>
          <h1>Sepolia Lottery</h1>
          <p className='subtitle'>Here we go for another excited round!</p>
        </header>

        <div className='info'>
          <div className='icon'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/>
            </svg>
            <p>Players: {players.length}</p>
          </div>
          <div className='icon'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
            </svg>
            <p>Prize: {balance ? `${web3.utils.fromWei(balance, 'ether')}eth` : '0eth'}</p>
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          <h2>Join the Sepolia lottery!</h2>
          <p>Enter this weeks draw for only <strong>0.1eth</strong>.
          <br /><br />The prize is drawn each Sunday evening at sun down</p>
          <input 
            autoComplete='true'
            id={addressInput}
            placeholder='enter your wallet address'
            type='text'
          />
          <button disabled={isFetching} type="submit">{isFetching ? 'check your wallet' : 'Enter'}</button>
        </form>

        <footer>
          <p className='small-print'>Game manager: {manager}</p>
        </footer>
      </div>
    </main>
  )
}

export default App;
