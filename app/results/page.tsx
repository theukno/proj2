"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const moodProducts = {
  happy: [
    { id: 1, name: "Celebration Box", price: 39.99, category: "Wellness", image: "/placeholder.svg", description: "A curated box of treats to celebrate good moments." },
    { id: 2, name: "Gratitude Journal", price: 14.99, category: "Accessories", image: "/placeholder.svg", description: "Record your daily moments of joy and gratitude." },
  ],
  calm: [
    { id: 5, name: "Calming Tea Set", price: 24.99, category: "Wellness", image: "/placeholder.svg", description: "A selection of herbal teas to help you relax and unwind." },
    { id: 6, name: "Aromatherapy Diffuser", price: 34.99, category: "Accessories", image: "/placeholder.svg", description: "Essential oil diffuser with calming scents." },
  ],
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const [mood, setMood] = useState("happy")
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const { addToCart } = useCart()
  const { toast } = useToast()

  const moodParam = searchParams.get("mood")
  useEffect(() => {
    if (moodParam && Object.keys(moodProducts).includes(moodParam)) {
      setMood(moodParam)
    }
  }, [searchParams])

  const filteredProducts = moodProducts[mood].filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "all" || product.category === category)
    )
  })

  const handleAddToCart = (product) => {
    addToCart(product)
    toast({ title: "Added to cart", description: `${product.name} has been added.` })
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto mb-6 text-center">
        <Badge className="mb-4 text-lg px-3 py-1">{mood.toUpperCase()}</Badge>
        <h1 className="text-3xl font-bold">Your Personalized Recommendations</h1>
      </div>
      
      <div className="flex gap-4 mb-6 justify-center">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-1/4"><SelectValue placeholder="Filter by category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Wellness">Wellness</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id}>
            <div className="relative h-48 w-full">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-bold">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAddToCart(product)}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
