import React, { useEffect, useState } from 'react';
import API from './api';

export default function Wallets(){
  const [wallets,setWallets] = useState([]);
  const [amount,setAmount] = useState('');
  const [toEmail,setToEmail] = useState('');
  const [selected,setSelected] = useState(null);

  async function load(){
    const res = await API.get('/wallets');
    setWallets(res.data);
    if(res.data[0]) setSelected(res.data[0].id);
  }

  useEffect(()=>{ load() }, []);

  async function createWallet(){
    const name = prompt('Wallet name') || 'New';
    await API.post('/wallets', { name });
    load();
  }

  async function send(){
    if(!selected) return alert('choose wallet');
    const cents = Math.round(parseFloat(amount)*100);
    await API.post(`/wallets/${selected}/send`, { toEmail, amountCents: cents });
    setAmount(''); setToEmail('');
    load();
  }

  return (
    <div style={{maxWidth:700, margin:'20px auto'}}>
      <h2>Your wallets</h2>
      <button onClick={createWallet}>Create Wallet</button>
      <ul>
        {wallets.map(w=> (
          <li key={w.id} style={{padding:10, border: selected===w.id ? '2px solid black' : '1px solid #ddd'}} onClick={()=>setSelected(w.id)}>
            <strong>{w.name}</strong> — {(w.balanceCents/100).toFixed(2)} {w.currency}
          </li>
        ))}
      </ul>
      <h3>Send money</h3>
      <div>
        <input placeholder="Recipient email" value={toEmail} onChange={e=>setToEmail(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
