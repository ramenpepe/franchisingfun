import React, { useState, useEffect, useMemo  } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LeftNavBar from "./components/LeftNavBar";
import Loader from "./components/Loader"
import RightPanel from "./components/RightPanel";
import {theme, GlobalCss} from './theme-mn';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  SolflareWalletAdapter,
  /* ... other adapters ... */
} from '@solana/wallet-adapter-wallets';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { Mint } from './components/Mint';
require('@solana/wallet-adapter-react-ui/styles.css');


function App() {

  const [activeItem, setActiveItem] = useState('Marketplace');
  const [curract, setCurract] = useState('...');
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(true);
  const [panelIsVisible, setPanelIsVisible] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [intervalId, setIntervalId] = useState(null);
  const network = WalletAdapterNetwork.Devnet;

  



  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      // ... other adapters ...
    ],
    []
  ); 

  //const apiUrl = process.env.REACT_APP_API_URL;
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
 
  const apiUrl = 'https://api.adappter.xyz/platform';
  const handleNavItemClick = (item) => {
    setActiveItem(item);

  };

  const retrieve = async (action,body,cstatus) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('login')}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Response:', data);
      setCurract(cstatus);
      //handleStatusUpdates(cstatus);
      //
      return data;
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false); // Ensure loading is turned off on error
    }
  };

 
  
  useEffect(() => {
   // verifySession();

    return () => {
      if (intervalId) {
        console.log("Cleanup interval: " + intervalId);
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <ThemeProvider theme={theme}>
       <CssBaseline />   <GlobalCss />
       
     
          <div className="App">
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
          
                <WalletModalProvider >
                  <div style={{  textAlign: 'right' }}>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                    
                    
                    </div>

               
          
          {isLoading &&
            <div class={`load-bg ${loadComplete ? '' : 'complete'}`}>
             <Loader/>
              <h3><sub>{curract}</sub></h3>
            </div>

          }


<div><LeftNavBar activeItem={activeItem} isNavVisible={isNavVisible} 
setIsNavVisible={setIsNavVisible} handleNavItemClick={handleNavItemClick} />
            <div className={`${panelIsVisible ? 'reduced' : 'fullview'} ${isNavVisible ? 'shownav' : 'hidenav'}`} >
           
              {activeItem === 'Marketplace' && <div>
                <h1>    marketplace of projects like pdf</h1>
              </div>}

              {activeItem === 'Launch' && <div>
                <div>    
                  <Mint />


                </div>
              </div>}

              {activeItem === 'Portfolio' && <div>
                <h1>Portfolio</h1>
                
              </div>}
              {activeItem === 'Governance' && <div>
                <h1>Governance</h1>
               
   </div>}
   {activeItem === 'Community' && <div>
   <h1>Community</h1>
               
   </div>}

            </div>
            <RightPanel  panelIsVisible={panelIsVisible} setPanelIsVisible={setPanelIsVisible} />
          </div>
           
          <Router>
            <Routes>
              <Route path="/explainer" element={<div><h1>Explainer...</h1></div>} />
          
            </Routes>
          </Router>
          </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
          </div>
          
        </ThemeProvider>
       
  );
}

export default App;
