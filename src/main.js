import './assets/main.css'

import { createApp, provide, h } from 'vue'
import App from './App.vue'
//or import App from './App.vue'
import router from './router'


//Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify/lib/framework.mjs'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


import { DefaultApolloClient } from '@vue/apollo-composable'
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from '@apollo/client/core'

const cache = new InMemoryCache()
const httpLink = new HttpLink({ uri: 'https://eth-sepolia.blockscout.com/graphiql' });
const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
  const token = "d7efcd40-4268-49e9-8295-a2c52f8c9d1d"
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
    return forward(operation);
  });

const apolloClient = new ApolloClient({
    link: concat(authMiddleware,httpLink),
    cache,
    // uri: 'https://subgraph.satsuma-prod.com/04c4d592f290/nicholass-team--726018/tt-sepolia/api',
  })

const vuetify = createVuetify({
    components,
    directives
})

const app = createApp({
    setup() {
        provide(DefaultApolloClient, apolloClient)
    },
    
    render : () => h(App),
})

app.use(vuetify)

app.use(router)

app.mount('#app')
