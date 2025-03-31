"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/cart-provider"
import { CreditCard, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cartItems, subtotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    cardNumber: "",
    expiry: "",
    cvc: ""
  })

  useEffect(() => {
    if (cartItems.length === 0 && !isComplete) {
      router.push("/cart")
    }
  }, [cartItems, isComplete, router])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.name) errors.name = "Full Name is required"
    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errors.email = "Valid email is required"
    if (!formData.address) errors.address = "Address is required"
    if (!formData.city) errors.city = "City is required"
    if (!formData.state) errors.state = "State is required"
    if (!formData.zip || !/^[0-9]{5}$/.test(formData.zip)) errors.zip = "Valid ZIP code is required"
    
    if (paymentMethod === "credit-card") {
      if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber)) errors.cardNumber = "Valid 16-digit card number is required"
      if (!formData.expiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(formData.expiry)) errors.expiry = "Valid expiry date (MM/YY) is required"
      if (!formData.cvc || !/^\d{3}$/.test(formData.cvc)) errors.cvc = "Valid 3-digit CVC is required"
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setFormErrors({ ...formErrors, [name]: "" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({ title: "Missing Information", description: "Please fill in all required fields correctly.", variant: "destructive" })
      return
    }

    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      clearCart()
      toast({ title: "Order Placed!", description: "Your order has been successfully placed." })
      setTimeout(() => {
        router.push("/checkout/invoice")
      }, 1500)
    }, 2000)
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
            <CardDescription>Enter your shipping details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="grid gap-2">
                <Label htmlFor={key}>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</Label>
                <Input id={key} name={key} value={value} onChange={handleInputChange} required />
                {formErrors[key] && <p className="text-red-500 text-sm">{formErrors[key]}</p>}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? "Processing..." : <><CreditCard className="mr-2 h-4 w-4" />Complete Order</>}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
