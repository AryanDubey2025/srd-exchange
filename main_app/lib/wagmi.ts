import { http, createConfig } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'SRD Exchange'
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'P2P USDT Trading Platform'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const appIcon = process.env.NEXT_PUBLIC_APP_ICON || 'https://your-domain.com/logo.png'

const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

if (!projectId) {
  throw new Error(`
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set.
    
    Get your Project ID from:
    👉 https://cloud.walletconnect.com
    
    Then add it to your .env.local file:
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
  `)
}

// Use reliable RPC endpoints
const BSC_RPC_URLS = alchemyApiKey 
? [
  `https://bnb-mainnet.g.alchemy.com/v2/${alchemyApiKey}`,
  'https://1rpc.io/bnb',
  'https://bsc-dataseed.bnbchain.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed1.ninicoin.io'
]
:[
  'https://1rpc.io/bnb',
      'https://bsc.nodereal.io',
      'https://bsc-dataseed.bnbchain.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed1.ninicoin.io'
]

export const config = createConfig({
  chains: [bsc],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ 
      projectId,
      metadata: {
        name: appName,
        description: appDescription,
        url: appUrl,
        icons: [appIcon]
      }
    }),
  ],
  transports: {
    [bsc.id]: http(BSC_RPC_URLS[0], {
      batch: true,
      fetchOptions: {
      },
      retryCount: 3,
      retryDelay: 1000
    })
  },
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

export { projectId }
