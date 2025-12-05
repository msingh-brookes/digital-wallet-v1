import React, { useEffect, useState } from 'react';
import Login from './Login';
import Wallets from './Wallets';
import { setToken } from './api';

export default function App(){
  const [logged, setLogged] = useState(false);

  useEffect(()=>{
    const t = localStorage.getItem('dw_token');
    if(t){ setToken(t); setLogged(true); }
  }, []);

  if(!logged) return <Login onLogin={()=>setLogged(true)} />;
  return (
    <div>
      <header style={{padding:10, background:'#f4f4f4'}}>
        <h1 style={{margin:0}}>Digital Wallet (Demo)</h1>
        <button style={{float:'right'}} onClick={()=>{ localStorage.removeItem('dw_token'); localStorage.removeItem('dw_user'); setToken(null); window.location.reload(); }}>Logout</button>
      </header>
      <Wallets />
    </div>
  );
}
