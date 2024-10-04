import React, { useState, useEffect, useMemo  } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LeftNavBar from "./components/LeftNavBar";
import Loader from "./components/Loader"
import RightPanel from "./components/RightPanel";
import {theme, GlobalCss} from './theme-mn';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

require('@solana/wallet-adapter-react-ui/styles.css');


function App() {

  const [activeItem, setActiveItem] = useState('Dashboard');
  const [curract, setCurract] = useState('...');
  const [isLoading, setIsLoading] = useState(false);
  const [loadComplete, setLoadComplete] = useState(true);
  const [panelIsVisible, setPanelIsVisible] = useState(true);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

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


  const network = WalletAdapterNetwork.Devnet;  // Set the network (can be 'devnet', 'testnet', or 'mainnet-beta')
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);  // Cluster API URL

  const wallets = useMemo(() => [
    new UnsafeBurnerWalletAdapter(),
    // Add more wallet adapters if needed (like Phantom, Solflare, etc.)
  ], [network]);
  
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
       <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
          {isLoading &&
            <div class={`load-bg ${loadComplete ? '' : 'complete'}`}>
             <Loader/>
              <h3><sub>{curract}</sub></h3>
            </div>

          }


<div><LeftNavBar activeItem={activeItem} isNavVisible={isNavVisible} 
setIsNavVisible={setIsNavVisible} handleNavItemClick={handleNavItemClick} />
            <div className={`${panelIsVisible ? 'reduced' : 'fullview'} ${isNavVisible ? 'shownav' : 'hidenav'}`} >
           
              {activeItem === 'Assets' && <div>
                <div>    </div>
              </div>}
              {activeItem === 'Contracts' && <div>
   
               
              </div>}

            </div>
            <RightPanel  panelIsVisible={panelIsVisible} setPanelIsVisible={setPanelIsVisible} />
          </div>
           
          <Router>
            <Routes>
              <Route path="/explainer" element={<div><h1>Explainer...</h1></div>} />
          
            </Routes>
          </Router>
            <WalletMultiButton />  {/* This adds the wallet connect button */}
            <WalletDisconnectButton />  {/* This adds a button to disconnect */}
            {/* Your app's other components go here */}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>

        </ThemeProvider>
       
  );
}

export default App;
