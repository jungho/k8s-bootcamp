import * as Cookie from 'js-cookie';

const adalConfig = {
  popUp: false,
  tenant: process.env.REACT_APP_TENANT || Cookie.get("AZURE_AD_TENANT") || 'architech.ca',
  clientId: process.env.REACT_APP_CLIENT_ID || Cookie.get('AZURE_APP_ID') || 'aa271f78-210a-46f2-a92d-ea0f5664aa39',
  extraQueryParameter: 'nux=1'
};

// console.log("adalConfif", adalConfig);
// console.log("Cookie", Cookie.get('AZURE_APP_ID'));

export default adalConfig;
