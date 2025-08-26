import { useAccount, useBalance, useChainId, useSwitchChain, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useState, useEffect } from 'react'
import { bsc } from 'wagmi/chains'
import { formatUnits, parseUnits, Address } from 'viem'

// Contract addresses
const CONTRACTS = {
  USDT: {
    [56]: '0x55d398326f99059fF775485246999027B3197955', // BSC USDT
    [97]: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', // BSC Testnet USDT
  } as Record<number, Address>,
}

const USDT_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const

// Helper function to safely convert BigInt to string for JSON serialization
const serializeBigInt = (value: bigint): string => {
  return value.toString()
}

// Helper function to create serializable wallet data
const createSerializableWalletData = (walletInfo: any) => {
  return {
    address: walletInfo.address,
    isConnected: walletInfo.isConnected,
    chainId: walletInfo.chainId,
    isOnBSC: walletInfo.isOnBSC,
    balances: {
      bnb: {
        raw: serializeBigInt(walletInfo.balances.bnb.raw),
        formatted: walletInfo.balances.bnb.formatted,
        symbol: walletInfo.balances.bnb.symbol
      },
      usdt: {
        raw: serializeBigInt(walletInfo.balances.usdt.raw),
        formatted: walletInfo.balances.usdt.formatted,
        symbol: walletInfo.balances.usdt.symbol
      }
    },
    canTrade: walletInfo.canTrade,
    lastUpdated: walletInfo.lastUpdated
  }
}

export function useWalletManager() {
  const { address, isConnected, isConnecting } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [walletData, setWalletData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Get native BNB balance
  const { data: bnbBalance, refetch: refetchBnb } = useBalance({
    address,
    chainId: bsc.id
  })

  // Get USDT balance
  const { data: usdtBalance, refetch: refetchUsdt } = useReadContract({
    address: CONTRACTS.USDT[chainId],
    abi: USDT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!CONTRACTS.USDT[chainId]
    }
  })

  // Transaction management
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Switch to BSC if needed
  const switchToBSC = async () => {
    if (chainId !== bsc.id) {
      try {
        await switchChain({ chainId: bsc.id })
        return true
      } catch (error) {
        console.error('Failed to switch to BSC:', error)
        return false
      }
    }
    return true
  }

  // Fetch comprehensive wallet data
  const fetchWalletData = async () => {
    if (!address || !isConnected) return null

    setIsLoading(true)
    try {
      // Refetch balances
      await Promise.all([refetchBnb(), refetchUsdt()])

      const walletInfo = {
        address,
        isConnected,
        chainId,
        isOnBSC: chainId === bsc.id || chainId === 97,
        balances: {
          bnb: {
            raw: bnbBalance?.value || BigInt(0),
            formatted: bnbBalance ? formatUnits(bnbBalance.value, 18) : '0',
            symbol: 'BNB'
          },
          usdt: {
            raw: usdtBalance || BigInt(0),
            formatted: usdtBalance ? formatUnits(usdtBalance, 6) : '0',
            symbol: 'USDT'
          }
        },
        canTrade: (bnbBalance?.value || BigInt(0)) > parseUnits('0.001', 18), // Has gas for transactions
        lastUpdated: new Date().toISOString()
      }

      setWalletData(walletInfo)
      
      // Return serializable version for API calls
      return createSerializableWalletData(walletInfo)
    } catch (error) {
      console.error('Error fetching wallet data:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // USDT Transfer function
  const transferUSDT = async (to: Address, amount: string) => {
    if (!address) throw new Error('Wallet not connected')
    
    const amountWei = parseUnits(amount, 6) // USDT has 6 decimals
    
    writeContract({
      address: CONTRACTS.USDT[chainId],
      abi: USDT_ABI,
      functionName: 'transfer',
      args: [to, amountWei],
    })
  }

  // USDT Approval function
  const approveUSDT = async (spender: Address, amount: string) => {
    if (!address) throw new Error('Wallet not connected')
    
    const amountWei = parseUnits(amount, 6)
    
    writeContract({
      address: CONTRACTS.USDT[chainId],
      abi: USDT_ABI,
      functionName: 'approve',
      args: [spender, amountWei],
    })
  }

  // Auto-fetch wallet data when connected
  useEffect(() => {
    if (isConnected && address) {
      fetchWalletData()
    }
  }, [isConnected, address, chainId])

  return {
    // Wallet state
    address,
    isConnected,
    isConnecting,
    chainId,
    walletData,
    isLoading,
    
    // Balances
    bnbBalance: walletData?.balances.bnb,
    usdtBalance: walletData?.balances.usdt,
    canTrade: walletData?.canTrade || false,
    
    // Network management
    isOnBSC: chainId === bsc.id || chainId === 97,
    switchToBSC,
    
    // Data management
    fetchWalletData,
    refetchBalances: () => Promise.all([refetchBnb(), refetchUsdt()]),
    
    // Transaction functions
    transferUSDT,
    approveUSDT,
    
    // Transaction state
    isPending,
    isConfirming,
    isSuccess,
    hash
  }
}