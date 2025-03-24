"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface InstallPromptProps {
  onDismiss: () => void
}

export default function InstallPrompt({ onDismiss }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if it's iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", (e) => {
        e.preventDefault()
      })
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null)
    onDismiss()
  }

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-20 max-w-md mx-auto">
      <CardHeader className="pb-2 flex flex-row items-start">
        <div>
          <CardTitle className="text-lg">Install App</CardTitle>
          <CardDescription>Install Water Tracker for a better experience</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onDismiss} className="ml-auto -mt-1 -mr-1">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pb-2">
        {isIOS ? (
          <p className="text-sm">
            Tap{" "}
            <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-1"
              >
                <path d="M7 11v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
                <path d="M14 11v8a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
                <path d="M10 2v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
                <path d="M17 2v16a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1z"></path>
              </svg>
            </span>{" "}
            and then "Add to Home Screen" to install the app.
          </p>
        ) : (
          <p className="text-sm">Install this app on your device for quick and easy access when you're on the go.</p>
        )}
      </CardContent>
      <CardFooter>
        {!isIOS && deferredPrompt && (
          <Button onClick={handleInstallClick} className="w-full">
            Install Now
          </Button>
        )}
        {!isIOS && !deferredPrompt && (
          <Button variant="outline" onClick={onDismiss} className="w-full">
            Maybe Later
          </Button>
        )}
        {isIOS && (
          <Button variant="outline" onClick={onDismiss} className="w-full">
            Got It
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

