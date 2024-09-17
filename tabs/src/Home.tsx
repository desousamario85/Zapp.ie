import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { callMsGraph, ProfileData } from "./components/UserDetails";
import { Stack, PrimaryButton, Image, Text } from '@fluentui/react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { IRawStyle } from '@fluentui/react';
import SignInSignOutButton from './components/SignInSignOutButton';
import './styles/Home.css';

const centeredImageStyle: IRawStyle = {
  display: 'block',
  margin: '0 auto',
  maxHeight: 'auto', // Maintain aspect ratio
  top: "100px",
};

export function Home() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const request = {
        scopes: ["User.Read"],
        account: accounts[0]
      };

      instance.acquireTokenSilent(request).then(response => {
        callMsGraph(response.accessToken).then(response => {
          setGraphData(response);
          if (response.id) {
            const User = response; console.log(User);
          }
        });
      }).catch(error => {
        instance.acquireTokenPopup(request).then(response => {
          callMsGraph(response.accessToken).then(response => {
            setGraphData(response);
            if (response.id) {
              const User = response;
            }
          });
        });
      });
    }
  }, [accounts, instance]);

  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="content">
        <Image src="eirevo.png" styles={{ root: centeredImageStyle }} alt="Eirevo" width="5%" />
        <AuthenticatedTemplate>
          <Text styles={{ root: { color: 'white', fontSize: '4vw', fontWeight: 'bold' } }}>
            Zapp.ie
          </Text>
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: '100px' } }}>
            {graphData && <ProfileData graphData={graphData} />}
          </Stack>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Text styles={{ root: { color: 'white', fontSize: '4vw', fontWeight: 'bold' } }}>
            Zapp.ie
          </Text>
          <Text styles={{ root: { textAlign: 'center', display: 'block', marginTop: '100px', color: 'white', fontSize: '1vw' } }}>
         <p>Boost collaboration, reward achievements, incentivize improvement, and drive real value with Zaps.</p>
<p>To get started, please log in to access your dashboard, manage your rewards, and start recognizing your teammates' efforts.</p>
<p><b>Log in now to power up your workplace!</b></p>
          </Text>
          <SignInSignOutButton />
        </UnauthenticatedTemplate>
      </div>
    </div>
  );
}

export default Home;