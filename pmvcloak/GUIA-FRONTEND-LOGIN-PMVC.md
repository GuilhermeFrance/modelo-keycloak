# Guia do Frontend da Tela de Login (PMVC)

Este documento explica como funciona o frontend do login customizado no tema PMVC do Keycloak.

## 1. Qual linguagem e tecnologia sao usadas

O frontend do login nao e uma SPA (React, Vue etc.). Ele e renderizado no servidor pelo Keycloak.

Componentes usados neste projeto:

- Freemarker Template Language (FTL): monta o HTML da tela de login.
- CSS: personaliza visual (cores, layout, tipografia, botao, inputs).
- Arquivo de mensagens .properties: define textos exibidos na interface.
- Keycloak Theme Engine: injeta dados do contexto (cliente, realm, URL de login, erros de validacao etc.).

### 1.1 O que e FTL (Freemarker Template Language)

FTL e a linguagem de template do Freemarker. Em vez de criar uma pagina HTML fixa, voce cria um "molde" com marcacoes dinamicas, e o Keycloak preenche essas marcacoes com os dados da requisicao de login.

Em outras palavras:

- HTML puro mostra sempre o mesmo conteudo.
- HTML com FTL pode variar por cliente, realm, idioma, erro de login, configuracoes de autenticacao e outros contextos.

Como isso funciona no Keycloak:

1. O navegador chama a URL de autenticacao.
2. O Keycloak monta um contexto com objetos como client, realm, auth, url e mensagens.
3. O arquivo .ftl e processado no servidor.
4. O resultado final enviado ao browser ja e HTML pronto.

Exemplos de sintaxe FTL usados no PMVC:

- Interpolacao de variavel:
  - ${msg("loginAccountTitle")}

- Condicional:
  - <#if realm.password> ... </#if>

- Atribuicao de variavel:
  - <#assign serverClientId = (client.clientId!"")?trim>

- Import de macros de layout:
  - <#import "template.ftl" as layout>

- Uso de macro:
  - <@layout.registrationLayout ... ; section>

No seu tema PMVC, o FTL e usado para:

- Selecionar o logo dinamicamente com base no clientId.
- Definir o que aparece em cada secao do layout (header, form, socialProviders, info).
- Renderizar labels e textos vindos de messages_en.properties via msg("chave").

Resumo pratico sobre FTL no projeto:

- Linguagem de template server-side.
- Executa no Keycloak, nao no navegador.
- Gera HTML final que depois recebe estilo do CSS.
- E a camada central da personalizacao da tela de login.

## 2. Estrutura do tema PMVC

Arquivos principais:

- themes/pmvc/login/theme.properties
- themes/pmvc/login/login.ftl
- themes/pmvc/login/resources/css/login.css
- themes/pmvc/login/messages/messages_en.properties
- themes/pmvc/login/resources/img/PMVCloak.png
- themes/pmvc/login/resources/img/modelo-pmvc.png

Observacao importante:

- No estado atual, o template efetivamente usado e themes/pmvc/login/login.ftl.
- Existe tambem themes/pmvc/login/templates/login.ftl, mas para esse setup o arquivo raiz login.ftl e o que deve ser considerado como fonte principal.

## 3. Como o login e renderizado

O fluxo simplificado e:

1. O usuario acessa a URL OIDC, por exemplo com client_id=modelo-pmvc.
2. O Keycloak identifica o realm e o tema configurado.
3. O Keycloak processa o login.ftl com dados de contexto (client, realm, auth, url, mensagens etc.).
4. O HTML final e enviado para o navegador.
5. O CSS do tema e aplicado para estilizar o card.

## 4. Como o login.ftl funciona (PMVC)

Arquivo: themes/pmvc/login/login.ftl

Pontos principais:

- Importa componentes padrao do Keycloak (template, field, buttons, social-providers, passkeys).
- Usa o macro registrationLayout, que divide a tela por secoes:
  - header
  - form
  - socialProviders
  - info

### 4.1 Logotipo dinamico por clientId

No template, o logo e definido com base no clientId:

- serverClientId recebe client.clientId.
- logoFile vira <clientId>.png quando existe clientId.
- Caso nao exista clientId, cai para PMVCloak.png.

Exemplo:

- client_id=modelo-pmvc
- logo carregado: resources/img/modelo-pmvc.png

### 4.2 Posicionamento do titulo

O texto "Entre com sua conta Keycloak" e exibido abaixo da imagem na secao form, nao no header.

## 5. Como o CSS controla o layout

Arquivo: themes/pmvc/login/resources/css/login.css

Regras principais:

- Fundo azul para a pagina de login.
- Card centralizado e branco, com sombra e borda arredondada.
- Header externo do Keycloak oculto (para evitar titulo duplicado fora do card).
- Inputs e botao customizados com paleta PMVC.

## 6. Como funciona o messages_en.properties

Arquivo: themes/pmvc/login/messages/messages_en.properties

Esse arquivo e um dicionario chave=valor usado pelo Keycloak para resolver textos na interface.

No FTL, os textos sao chamados por msg("chave").

Exemplo real do PMVC:

- loginAccountTitle=Entre com sua conta Keycloak
- usernameOrEmail=Usuario:
- password=Senha:
- doLogIn=Entrar
- loginTitle=Login PMVC
- loginTitleHtml=Login PMVC

### 6.1 Onde cada chave aparece

- loginAccountTitle:
  - usado no template via msg("loginAccountTitle").
  - aparece abaixo do logo.

- doLogIn:
  - usado pelo botao de submit padrao do Keycloak.
  - define o texto do botao (Entrar).

- loginTitle e loginTitleHtml:
  - definem o titulo da pagina (tag title) e variacoes do titulo renderizado.

- usernameOrEmail e password:
  - textos dos labels dos campos.

## 7. Como adicionar logo para novo cliente

Para suportar novo cliente no card:

1. Descobrir o clientId do cliente no Keycloak.
2. Adicionar uma imagem em themes/pmvc/login/resources/img/<clientId>.png.
3. Reiniciar o container do Keycloak (ou invalidar cache de tema).
4. Acessar login com esse client_id.

Exemplo:

- clientId: modelo-pmvc
- arquivo: themes/pmvc/login/resources/img/modelo-pmvc.png

## 8. Dicas de manutencao

- Mantenha um unico template principal (preferencialmente themes/pmvc/login/login.ftl) para evitar divergencia.
- Se alterar mensagens, atualize messages_en.properties.
- Se alterar estilo visual, centralize no login.css.
- Ao nao ver mudanca no navegador, faca hard refresh.
- Em ambiente Docker, se necessario, reinicie o servico keycloak.

## 9. Resumo rapido

- Linguagem principal do frontend de login: Freemarker (FTL) + CSS.
- Renderizacao: server-side pelo Keycloak.
- Textos: messages_en.properties via msg("chave").
- Logo por cliente: baseado em client.clientId para mapear <clientId>.png.
- Arquivo principal atual do layout customizado: themes/pmvc/login/login.ftl.
