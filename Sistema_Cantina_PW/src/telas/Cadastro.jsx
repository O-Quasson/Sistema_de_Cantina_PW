import React from "react";
import logo from '../assets/logo.png'
import { isDesktop } from "react-device-detect";
import { Link } from "react-router-dom";

function Cadastroscreen() {
    if(isDesktop){
        return(
            <>
                <header style={{backgroundColor: '#110E41', height: '4.5rem', justifyContent: 'space-between', alignItems: 'center', display: 'flex', width: "100%", padding: '3% 5% 3% 5%', boxSizing: 'border-box'}}>
                    <Link to='/'>
                        <img src={logo} style={{width: '11%'}}/>
                    </Link>
                  
                    <div style={{gap: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Link to='/login'>
                            <button style={{backgroundColor: "#6B0707", width: '175%',  height: '3rem', color: 'white', fontSize: "120%", borderRadius: 7, boxShadow: 'none', outline: 'none', border: 'none', cursor: 'pointer'}}>Entrar</button>
                        </Link>
                        
                        <Link to='/cadastro'>
                            <button style={{backgroundColor: "#6B0707", width: '120%', height: "3rem",  color: 'white', fontSize: '120%', borderRadius: 7, boxShadow: 'none', outline: 'none', border: 'none', cursor: 'pointer'}}>Cadastrar</button>
                        </Link>
                    </div>
                        
                </header>

                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%'}}>
                    <h1 style={{fontFamily: 'Dancing Script', fontSize: '400%', color: '#6B0707', textShadow: '-1px -1px 0 #000'}}>Cadastrar</h1>

                    <form style={{backgroundImage: 'linear-gradient(180deg , #070048, #3A0202)', padding: '2% 4%', borderRadius: 15, color: 'white', display: 'flex', flexDirection: 'column', gap: '3rem', width: '25%'}}>
                        
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='RM' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>RM:</label>
                                <input type='number' id='RM' name='RM' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='email' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Email:</label>
                                <input type='email' id='email' name='email' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='senha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='password' id='senha' name='senha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='Csenha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Confirmar senha:</label>
                                <input type='password' id='Csenha' name='Csenha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>
                        </div>
                        
                        <input type='submit' value="Cadastrar" style={{backgroundColor: '#6B0707', outline: 'none', border: 'none', borderRadius: 12, color: 'white', height: '4.5rem', fontSize: '125%'}}/>
                    
                    </form>
                </div>
            </>
        )
    }else{
        return(
           <>
                <header style={{backgroundColor: '#110E41', height: '4rem', justifyContent: 'space-between', alignItems: 'center', display: 'flex', width: window.innerWidth, padding: '2%', boxSizing: 'border-box', margin: 0, marginBottom: '15%', objectFit: 'contain'}}>
                    <Link to='/' style={{width: '20%'}}>
                        <img src={logo} style={{width: '100%', flexShrink: 0}}/>
                    </Link>
                    <div style={{gap: '1rem', display: 'flex', alignItems: 'center'}}>
                        <Link to="/login">
                            <button style={{backgroundColor: "#6B0707", color: 'white', boxShadow: 'none', outline: 'none', border: 'none', fontSize: '100%', borderRadius: 7, padding: '0.5rem' }}>Entrar</button>
                        </Link>
                   
                        <Link to='/cadastro'>
                            <button style={{backgroundColor: "#6B0707", color: 'white', boxShadow: 'none', outline: 'none', border: 'none', fontSize: '100%', borderRadius: 7, padding: '0.5rem'}}>Cadastrar</button>
                        </Link> 
                    </div>
                </header>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%'}}>
                    <h1 style={{fontFamily: 'Dancing Script', fontSize: '400%', color: '#6B0707', textShadow: '-1px -1px 0 #000'}}>Cadastrar</h1>
                    <form style={{backgroundImage: 'linear-gradient(180deg , #070048, #3A0202)', padding: '7% 7%', borderRadius: 15, color: 'white', display: 'flex', flexDirection: 'column', gap: '3rem', width: '75%'}}>
                       
                        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='RM' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>RM:</label>
                                <input type='number' id='RM' name='RM' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='email' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='email' id='email' name='email' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='senha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='password' id='senha' name='senha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                            <div style={{display: 'flex', gap: '0.5rem', flexDirection: 'column'}}>
                                <label for='Csenha' style={{fontSize: '125%', fontFamily: 'sans-serif'}}>Senha:</label>
                                <input type='password' id='Csenha' name='Csenha' style={{borderRadius: 5, outline: 'none', border: 'none', padding: '5%', width: '100%', boxSizing: 'border-box'}} />
                            </div>

                        </div>
                       
                        <input type='submit' value="Cadastrar" style={{backgroundColor: '#6B0707', outline: 'none', border: 'none', borderRadius: 12, color: 'white', height: '3.5rem', fontSize: '125%'}}/>
                   
                    </form>
                </div>
            </>
        )
    }
    
}

export default Cadastroscreen;