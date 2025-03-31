"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, CreditCard, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedInUser = localStorage.getItem("loggedInUser");
      setIsLoggedIn(!!loggedInUser);
    }
  }, []);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsCheckoutOpen(true);
    } else {
      router.push("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <PayPalScriptProvider options={{ "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID }}>
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
            ))}
          </div>
          <OrderSummary subtotal={subtotal} handleCheckout={handleCheckout} clearCart={clearCart} />
        </div>
        <LoginDialog isCheckoutOpen={isCheckoutOpen} setIsCheckoutOpen={setIsCheckoutOpen} setIsLoggedIn={setIsLoggedIn} />
      </div>
    </PayPalScriptProvider>
  );
}

function OrderSummary({ subtotal, handleCheckout, clearCart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
        <div className="flex justify-between font-medium text-lg"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={handleCheckout}><CreditCard className="mr-2 h-4 w-4" />Checkout</Button>
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: { value: subtotal.toFixed(2) }
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(() => {
              clearCart();
              alert("Payment successful!");
            });
          }}
          onError={(err) => {
            console.error("PayPal Checkout Error:", err);
            alert("Payment failed. Please try again.");
          }}
        />
        <Button variant="outline" className="w-full" onClick={clearCart}>Clear Cart</Button>
      </CardFooter>
    </Card>
  );
}
