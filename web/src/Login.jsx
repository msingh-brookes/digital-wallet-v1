import React, { useState } from 'react';
import API, { setToken } from './api';

export default function Login({ onLogin }){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [isRegister,setIsRegister]=useState(false);

  async function submit(e){
    e.preventDefault();
    try{
      const url = isRegister ? '/auth/register' : '/auth/login';
      const res = await API.post(url, { email, password, name: 'Demo' });
      const { accessToken, user } = res.data;
      setToken(accessToken);
      localStorage.setItem('dw_token', accessToken);
      localStorage.setItem('dw_user', JSON.stringify(user));
      onLogin();
    } catch(err){
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div style={{maxWidth:400, margin:'40px auto'}}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={()=>setIsRegister(s=>!s)} style={{marginTop:10}}>{isRegister ? 'Have an account? Login' : 'Create account'}</button>
    </div>
  );
}
