import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: process.env.KEYCLOAK_URL || 'http://localhost:8081',
  realm: process.env.KEYCLOAK_REALM || 'PMVC',
  clientId: process.env.KEYCLOAK_CLIENT_ID || 'modelo-pmvc'
});

export default keycloak;
