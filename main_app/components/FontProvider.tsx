'use client'

import { useEffect } from 'react'

export default function FontProvider() {
  useEffect(() => {
    // Ensure Montserrat is loaded and applied globally
    document.documentElement.style.setProperty('--font-family', 'Montserrat, sans-serif')
    
    // Apply to all existing elements
    const allElements = document.querySelectorAll('*')
    allElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.fontFamily = 'Montserrat, sans-serif'
      }
    })
  }, [])

  return null
}