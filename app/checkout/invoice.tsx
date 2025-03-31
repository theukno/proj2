"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Download, ShoppingBag, Home, Printer, Mail } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function InvoicePage() {
  const invoiceRef = useRef(null)
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: `MS-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toLocaleDateString(),
    items: [{ id: 1, name: "Sample Product", price: 29.99, quantity: 1 }],
    subtotal: 29.99,
    shipping: 0,
    total: 29.99,
    customer: {
      name: "John Doe",
      email: "john@example.com",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "12345",
      country: "United States",
    },
  })

  useEffect(() => {
    const storedOrder = localStorage.getItem("lastOrder")
    if (storedOrder) {
      try {
        setOrderDetails(JSON.parse(storedOrder))
      } catch (error) {
        console.error("Failed to parse order details:", error)
      }
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (invoiceRef.current) {
      const canvas = await html2canvas(invoiceRef.current)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF()
      const imgWidth = 190
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)
      pdf.save(`Invoice_${orderDetails.orderNumber}.pdf`)
    }
  }

  const handleEmailInvoice = () => {
    const mailtoLink = `mailto:${orderDetails.customer.email}?subject=Your Invoice ${orderDetails.orderNumber}&body=Dear ${orderDetails.customer.name},%0D%0A%0D%0AHere is your invoice for order ${orderDetails.orderNumber}.%0D%0A%0D%0ATotal Amount: $${orderDetails.total.toFixed(2)}%0D%0A%0D%0AThank you for your purchase!`;
    window.location.href = mailtoLink;
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Invoice</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleEmailInvoice}>
            <Mail className="mr-2 h-4 w-4" />
            Email Invoice
          </Button>
        </div>
      </div>

      <Card ref={invoiceRef} className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Invoice #</p>
              <CardTitle>{orderDetails.orderNumber}</CardTitle>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date</p>
              <p>{orderDetails.date}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">Bill To:</p>
              <p className="font-medium">{orderDetails.customer.name}</p>
              <p>{orderDetails.customer.address}</p>
              <p>
                {orderDetails.customer.city}, {orderDetails.customer.state} {orderDetails.customer.zip}
              </p>
              <p>{orderDetails.customer.country}</p>
              <p className="mt-2">{orderDetails.customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Payment Method:</p>
              <p>PayPal (Test Mode)</p>
              <p className="text-sm font-medium mt-4 mb-2">Shipping Method:</p>
              <p>Standard Shipping (3-5 business days)</p>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-4">Order Items:</p>
            <div className="space-y-2">
              {orderDetails.items.length > 0 ? (
                orderDetails.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 text-sm py-2">
                    <div className="col-span-6">{item.name}</div>
                    <div className="col-span-2 text-right">${item.price.toFixed(2)}</div>
                    <div className="col-span-2 text-right">{item.quantity}</div>
                    <div className="col-span-2 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center">No items in this order.</p>
              )}
              <Separator />
              <div className="grid grid-cols-12 text-sm py-2 font-bold">
                <div className="col-span-10 text-right">Total</div>
                <div className="col-span-2 text-right">${orderDetails.total.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
