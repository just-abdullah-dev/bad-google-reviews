'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"

// interface PaymentModalProps {
//   isOpen: boolean
//   onClose: () => void
//   paymentStatus: 'COMPLETED' | 'error'
//   payerName: string
//   updatedBalance: number
//   message?: string
// }

export default function PaymentMessage({ 
  isOpen, 
  onClose, 
  paymentStatus, 
  message,
  payerName = '', 
  updatedBalance = 0.00, 
  id = ''
}) {
  const [open, setOpen] = useState(isOpen)
const balance = Number(updatedBalance);
  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {paymentStatus === 'COMPLETED' ? 'Payment Completed' : 'Payment Error'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 text-center ">
          {paymentStatus === 'COMPLETED' ? (
            <>
              <CheckCircle2 className="w-20 h-20 mx-auto text-green-500 mb-4" />
              <p className="text-xl font-semibold mb-2 ">Thank you, {payerName}!</p>
              <p className="text-gray-600 mb-4 ">
                {message}
              </p>
             <p className="text-lg font-medium mt-8">
               Transaction ID: <span className="text-black">{id}</span>
              </p>
              <p className="text-lg font-medium">
               Payer Name: <span className="text-black">{payerName}</span>
              </p>
              <p className="text-lg font-medium">
                Current Balance: <span className="text-green-600">{process.env.NEXT_PUBLIC_CURRENCY_SYMBOL} {balance.toFixed(2)}</span>
              </p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <p className="text-xl font-semibold mb-2">Oops! Something went wrong.</p>
              <p className="text-red-600 mb-4">{message}</p>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </DialogContent>
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          aria-hidden="true"
        />
      )}
    </Dialog>
  )
}