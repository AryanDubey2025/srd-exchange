"use client"

import { Headset } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer 
      className="bg-black text-white border-gray-800"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-8 py-8 bg-[#0C0C0C] rounded-xl mb-8">
        <div className="flex items-center justify-between">
          {/* Left side - Logo */}
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.img 
              src="/logo.svg" 
              alt="SRD Exchange Logo" 
              className="w-12 h-12"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Right side - Support and Telegram */}
          <motion.div 
            className="flex flex-col items-start gap-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.button 
              className="text-white border border-[#622DBF] px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              whileHover={{ scale: 1.05, borderColor: "#8b5cf6" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img 
                src="/telegram.svg" 
                alt="" 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              />
              Telegram community
            </motion.button>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <Headset className="w-4 h-4"/>
              </motion.div>
              <span className="text-gray-400 text-sm">24 x 7 Support</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}