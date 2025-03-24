"use client"

import { useState, useEffect } from "react"
import { X, Download, Share } from "lucide-react"
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
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)

      // We've used the prompt, and can't use it again, throw it away
      setDeferredPrompt(null)
      onDismiss()
    } else {
      // Jika deferredPrompt tidak tersedia, buka instruksi manual
      alert(
        "Untuk menginstal aplikasi:\n\n1. Ketuk ikon menu tiga titik (⋮) di pojok kanan atas Chrome\n2. Pilih 'Install app' atau 'Add to Home screen'\n3. Ikuti petunjuk instalasi",
      )
    }
  }

  const handleManualInstall = () => {
    if (isIOS) {
      alert(
        "Untuk menginstal di iOS:\n\n1. Ketuk ikon Share (kotak dengan panah ke atas)\n2. Gulir ke bawah dan ketuk 'Add to Home Screen'\n3. Ketuk 'Add' di pojok kanan atas",
      )
    } else {
      alert(
        "Untuk menginstal di Android:\n\n1. Ketuk ikon menu tiga titik (⋮) di pojok kanan atas Chrome\n2. Pilih 'Install app' atau 'Add to Home screen'\n3. Ikuti petunjuk instalasi",
      )
    }
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
        <p className="text-sm">Install this app on your device for quick and easy access when you're on the go.</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button onClick={handleInstallClick} className="w-full bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Install Now
        </Button>

        <Button onClick={handleManualInstall} variant="outline" className="w-full">
          <Share className="mr-2 h-4 w-4" />
          Show Manual Install Steps
        </Button>

        <Button variant="ghost" onClick={onDismiss} className="w-full">
          Maybe Later
        </Button>
      </CardFooter>
    </Card>
  )
}

