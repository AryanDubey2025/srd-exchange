import { http, createConfig } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { 
  walletConnect, 
  injected, 
  metaMask, 
  coinbaseWallet,

} from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'SRD Exchange'
const appDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'P2P USDT Trading Platform'
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const appIcon = process.env.NEXT_PUBLIC_APP_ICON || 'https://your-domain.com/logo.png'

if (!projectId) {
  throw new Error(`
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set.
    
    Get your Project ID from:
    👉 https://cloud.walletconnect.com
    
    Then add it to your .env.local file:
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
  `)
}

export const config = createConfig({
  chains: [bsc, bscTestnet],
  connectors: [
    // WalletConnect - Supports 300+ wallets
    walletConnect({ 
      projectId,
      metadata: {
        name: appName,
        description: appDescription,
        url: appUrl,
        icons: [appIcon]
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '9999',
          '--wcm-background-color': '#0A0A0A',
          '--wcm-accent-color': '#622DBF'
        }
      }
    }),
    // Native wallet connectors
    injected({ 
      shimDisconnect: true 
    }),
    metaMask({
      dappMetadata: {
        name: appName,
        url: appUrl,
      }
    }),
    coinbaseWallet({
      appName,
      appLogoUrl: appIcon,
      darkMode: true
    }),

  ],
  transports: {
    [bsc.id]: http(process.env.NEXT_PUBLIC_BSC_RPC_URL),
    [bscTestnet.id]: http(process.env.NEXT_PUBLIC_BSC_TESTNET_RPC_URL),
  },
  ssr: true,
})

export { projectId }
