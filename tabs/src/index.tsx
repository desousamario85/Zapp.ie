import React from 'react';
import ReactDOM from 'react-dom/client';
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@fluentui/react';
import { theme } from './styles/Theme'; // Adjust the import path as necessary
import App from './App'; // Adjust the import path as necessary
import { msalConfig } from './services/authConfig';

export const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(() => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  msalInstance.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const payload = event.payload as AuthenticationResult;
      const account = payload.account;
      msalInstance.setActiveAccount(account);
    }
  });

  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container!);
  root.render(
    <MsalProvider instance={msalInstance}>
      <Router>
        <ThemeProvider theme={theme}>
          <App pca={msalInstance} />
        </ThemeProvider>
      </Router>
    </MsalProvider>
  );
});