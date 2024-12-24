'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OTPVerificationPage() {
  const [otpState, setOtpState] = useState(['', '', '', '', '', ''])
//   const [formState, formAction] = useFormState(Number, null)

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpState = [...otpState]
      newOtpState[index] = value
      setOtpState(newOtpState)

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpState[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      prevInput?.focus()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className='text-red-600'>OTP Verification</CardTitle>
          <CardDescription>Enter the 6-digit code sent to your device</CardDescription>
        </CardHeader>
        <form action="/auth/new-password" method='POST'>
          <CardContent>
            <div className="flex justify-between mb-4">
              {otpState.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  className="w-12 h-12 text-center text-2xl"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                />
              ))}
            </div>
            <input
              type="hidden"
              name="otp"
              value={otpState.join('')}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">Verify OTP</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

