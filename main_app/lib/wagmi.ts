import { http, createConfig } from 'wagmi'
import { bscTestnet, bsc } from 'wagmi/chains'
import { walletConnect, injected, metaMask } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

export const config = createConfig({
  chains: [bscTestnet, bsc],
  connectors: [
    walletConnect({ 
      projectId,
      metadata: {
        name: 'P2P USDT Trading',
        description: 'Admin-controlled P2P USDT Trading Platform',
        url: 'https://yourapp.com',
        icons: ['https://yourapp.com/icon.png']
      }
    }),
    injected(),
    metaMask(),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [bsc.id]: http(),
  },
})
