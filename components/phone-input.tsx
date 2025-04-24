"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  label?: string
  id?: string
  className?: string
}

// Common country codes for India and a few other countries
const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
  { code: "+61", country: "Australia" },
]

export default function PhoneInput({
  value,
  onChange,
  error,
  required = false,
  label = "Phone Number",
  id = "phone",
  className = "",
}: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("+91") // Default to India
  const [phoneNumber, setPhoneNumber] = useState("")

  // Parse the initial value to set country code and phone number
  useEffect(() => {
    if (value) {
      // Check if value starts with a country code
      const matchedCode = countryCodes.find((cc) => value.startsWith(cc.code))
      if (matchedCode) {
        setCountryCode(matchedCode.code)
        setPhoneNumber(value.substring(matchedCode.code.length))
      } else {
        // If no country code is found, assume it's just the number
        setPhoneNumber(value)
      }
    }
  }, [value])

  // Handle phone number change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value

    // Only allow digits, spaces, and hyphens
    if (/^[\d\s-]*$/.test(newPhoneNumber)) {
      setPhoneNumber(newPhoneNumber)
      onChange(`${countryCode}${newPhoneNumber}`)
    }
  }

  // Handle country code change
  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode)
    onChange(`${newCode}${phoneNumber}`)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="flex">
        <Select value={countryCode} onValueChange={handleCountryCodeChange}>
          <SelectTrigger className="w-[110px] rounded-r-none">
            <SelectValue placeholder="+91" />
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((cc) => (
              <SelectItem key={cc.code} value={cc.code}>
                {cc.code} {cc.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          id={id}
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="9876543210"
          className={`rounded-l-none ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
          required={required}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
