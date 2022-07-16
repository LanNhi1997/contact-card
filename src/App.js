import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'
import { utils } from "near-api-js";

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  
  const [token, setToken] = React.useState(null)
  const [contact, setContact] = React.useState({})

  React.useEffect(
    () => {
      window.contract.nft_token({ token_id: "samnguyen.testnet" })
      .then(token => {
        setToken(token)
      })
    },
    []
  )

  const info = token?.metadata?.extra ? JSON.parse(token.metadata.extra) : {}

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      {token && <div style={{width: "50%", marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>
        Your contact card:
        <div className="card" style={{"width": "500px"}}>
          <div className="card-body">
            <h5 className="card-title">{info.name}</h5>
            <p className="card-text">Number: <a href={info.number}>{info.number}</a></p>
            <p className="card-text">Facebook: <a href={info.facebook}>{info.facebook}</a></p>
            <p className="card-text">Twitter: <a href={info.twitter}>{info.twitter}</a></p>
            <p className="card-text">Instagram: <a href={info.instagram}>{info.instagram}</a></p>
            
          </div>
        </div>
      </div>}
      {!token && <div style={{width: "50%", marginLeft: "auto", marginRight: "auto", marginTop: "50px"}}>
        Enter your contact:
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Username" 
            aria-label="Username" 
            aria-describedby="basic-addon1"
            onChange={(event) => setContact({...contact, name: event.target.value})}
          />
        </div>
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Number" 
            aria-label="Username" 
            aria-describedby="basic-addon1" 
            onChange={(event) => setContact({...contact, number: event.target.value})}
          />
        </div>
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Facebook" 
            aria-label="Username" 
            aria-describedby="basic-addon1" 
            onChange={(event) => setContact({...contact, facebook: event.target.value})}
          />
        </div>
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Twitter" 
            aria-label="Twitter" 
            aria-describedby="basic-addon1" 
            onChange={(event) => setContact({...contact, twitter: event.target.value})}
          />
        </div>
        <div className="input-group mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Instagram" 
            aria-label="Username" 
            aria-describedby="basic-addon1" 
            onChange={(event) => setContact({...contact, instagram: event.target.value})}
          />
        </div>
        <div className="d-grid gap-2">
          <button className="btn btn-primary" type="button" onClick={() => {
            if (!contact || !contact.name || !contact.number) {
              alert('Name and number is require')
              return
            }
            window.contract.nft_mint(
              {
                token_id: window.accountId,
                receiver_id: window.accountId,
                token_metadata: {
                  extra: JSON.stringify(contact)
                }
              }, 
              10000000000000, 
              utils.format.parseNearAmount("0.1")
            ).then(() => window.location.reload())
          }}>Submit</button>
        </div>
      </div>}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'set_greeting' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
