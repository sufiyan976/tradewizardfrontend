"use client"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <div className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">
            {/* Realistic Sun */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              <circle cx="12" cy="12" r="5.5" fill="#FFCC33" />
              <circle cx="12" cy="12" r="8" stroke="#FFCC33" strokeWidth="1" />
              <path d="M12 3V5" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 19V21" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 12H5" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M19 12H21" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M5.63604 5.63604L7.05026 7.05026" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M16.9497 16.9497L18.364 18.364" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M5.63604 18.364L7.05026 16.9497" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <path d="M16.9497 7.05026L18.364 5.63604" stroke="#FFCC33" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3.5" fill="#FFE066" />
            </svg>
          </div>
          <div className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">
            {/* Refined Realistic Half Moon with Cloud Backdrop */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
              {/* Cloud backdrop - positioned to frame the moon */}
              <path
                d="M20 15C20 13.34 18.66 12 17 12C16.5 12 16.03 12.15 15.63 12.39C15.86 11.6 16 10.77 16 9.9C16 7.19 13.81 5 11.1 5C8.39 5 6.2 7.19 6.2 9.9C6.2 10.18 6.23 10.45 6.27 10.71C5.86 10.56 5.43 10.5 5 10.5C3.34 10.5 2 11.84 2 13.5C2 15.16 3.34 16.5 5 16.5H17C18.66 16.5 20 15.16 20 13.5V15Z"
                fill="#C8C8D6"
              />
              <path
                d="M19 17C19 15.34 17.66 14 16 14C15.5 14 15.03 14.15 14.63 14.39C14.86 13.6 15 12.77 15 11.9C15 9.19 12.81 7 10.1 7C7.39 7 5.2 9.19 5.2 11.9C5.2 12.18 5.23 12.45 5.27 12.71C4.86 12.56 4.43 12.5 4 12.5C2.34 12.5 1 13.84 1 15.5C1 17.16 2.34 18.5 4 18.5H16C17.66 18.5 19 17.16 19 15.5V17Z"
                fill="#D8D8E6"
              />

              {/* Bright Half Moon with enhanced realism */}
              <g filter="url(#moon_glow)">
                {/* Full circle for the moon base */}
                <circle cx="12" cy="12" r="6" fill="#FFFFFF" />

                {/* Half-moon shadow overlay */}
                <path
                  d="M12 6C12 6 12 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6Z"
                  fill="#2A2A3A"
                  fillOpacity="0.2"
                />

                {/* Gradient overlay for realistic shading */}
                <circle cx="12" cy="12" r="6" fill="url(#moon_gradient)" fillOpacity="0.3" />

                {/* Thin border for definition */}
                <circle cx="12" cy="12" r="6" stroke="#F8F8FF" strokeWidth="0.3" />
              </g>

              {/* Realistic crater details */}
              <circle cx="9.5" cy="10" r="0.7" fill="#E8E8F0" />
              <circle cx="14" cy="13" r="0.9" fill="#E8E8F0" />
              <circle cx="10.5" cy="14" r="0.6" fill="#E8E8F0" />
              <circle cx="13" cy="9.5" r="0.5" fill="#E8E8F0" />

              {/* Subtle cloud highlights that interact with moon's glow */}
              <path
                d="M14 13C14.5 12.5 15.5 12.7 16 13C16.5 13.3 17 14 17 14.5"
                stroke="#F0F0FA"
                strokeWidth="0.3"
                strokeLinecap="round"
              />
              <path
                d="M8 12C8.5 11.5 9.5 11.7 10 12C10.5 12.3 11 13 11 13.5"
                stroke="#F0F0FA"
                strokeWidth="0.3"
                strokeLinecap="round"
              />

              {/* Definitions for filters and gradients */}
              <defs>
                {/* Glow effect for the moon */}
                <filter
                  id="moon_glow"
                  x="5.5"
                  y="5.5"
                  width="13"
                  height="13"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation="0.7" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                </filter>

                {/* Gradient for realistic moon shading */}
                <radialGradient
                  id="moon_gradient"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(10 10) rotate(45) scale(8.5)"
                >
                  <stop stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#E0E0E6" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
