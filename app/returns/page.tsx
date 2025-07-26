import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, Shield, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">Returns & Exchanges</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We want you to love your purchase. Learn about our hassle-free return and exchange policy.
            </p>
          </div>
        </section>

        {/* Returns Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
              {/* Return Policy Banner */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <RotateCcw className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">30-Day Return Policy</h3>
                      <p className="text-muted-foreground">
                        Not satisfied? Return your items within 30 days for a full refund or exchange.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Return Process */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">How to Return</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        Initiate Return
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Contact our customer service or use our online return form to start the process.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        Pack & Ship
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Pack the item securely and ship it back using our prepaid return label.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        Get Refund
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Once we receive and inspect your return, we'll process your refund within 5-7 business days.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Return Conditions */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">Return Conditions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        Eligible for Return
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Items in original condition with tags</li>
                        <li>• Unworn and unwashed clothing</li>
                        <li>• Jewelry in original packaging</li>
                        <li>• Items returned within 30 days</li>
                        <li>• Original receipt or order number</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-red-600">
                        <Shield className="h-5 w-5" />
                        Not Eligible for Return
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Personalized or customized items</li>
                        <li>• Items damaged by misuse</li>
                        <li>• Worn or washed clothing</li>
                        <li>• Items without original packaging</li>
                        <li>• Sale items (unless defective)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Refund Information */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">Refund Information</h2>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        Processing Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Return received and inspected:</span>
                          <Badge variant="secondary">1-2 business days</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Refund processed:</span>
                          <Badge variant="secondary">3-5 business days</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Amount credited to account:</span>
                          <Badge variant="secondary">5-7 business days</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Refund Methods</h4>
                      <p className="text-muted-foreground text-sm mb-4">
                        Refunds will be processed using the same payment method used for the original purchase.
                      </p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Credit/Debit Card: 5-7 business days</li>
                        <li>• UPI/Digital Wallet: 3-5 business days</li>
                        <li>• Net Banking: 5-7 business days</li>
                        <li>• Cash on Delivery: Bank transfer within 7-10 days</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Exchange Policy */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">Exchange Policy</h2>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4">
                      We offer exchanges for size or color variations within 30 days of purchase. The item must be in
                      original condition with tags attached.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Exchange processing time: 7-10 business days</p>
                      <p>• Free exchange for defective items</p>
                      <p>• Size/color exchanges subject to availability</p>
                      <p>• Price difference (if any) will be charged/refunded</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact for Returns */}
              <Card className="bg-muted/50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2">Need Help with Returns?</h3>
                  <p className="text-muted-foreground mb-4">
                    Our customer service team is here to assist you with any return or exchange questions.
                  </p>
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
