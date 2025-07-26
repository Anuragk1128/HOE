import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Package } from "lucide-react"

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">Shipping Information</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn about our shipping options, delivery times, and policies.
            </p>
          </div>
        </section>

        {/* Shipping Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
              {/* Free Shipping Banner */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Truck className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">Free Shipping Available!</h3>
                      <p className="text-muted-foreground">Enjoy free shipping on all orders over ₹500 within India</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Options */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">Shipping Options</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-primary" />
                        Standard Shipping
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Delivery Time:</span>
                          <Badge variant="secondary">5-7 business days</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost:</span>
                          <span>₹99 (Free over ₹500)</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Standard delivery to your doorstep via our trusted courier partners.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        Express Shipping
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Delivery Time:</span>
                          <Badge variant="secondary">2-3 business days</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost:</span>
                          <span>₹199</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Faster delivery for urgent orders with priority handling.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Delivery Areas */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">Delivery Areas</h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      Coverage Areas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Metro Cities</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• Mumbai, Delhi, Bangalore</li>
                          <li>• Chennai, Kolkata, Hyderabad</li>
                          <li>• Pune, Ahmedabad, Jaipur</li>
                          <li>• 2-3 business days delivery</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Other Cities</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• All major cities and towns</li>
                          <li>• Rural areas (selected locations)</li>
                          <li>• 5-7 business days delivery</li>
                          <li>• Additional charges may apply</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Policy */}
              <div>
                <h2 className="font-playfair text-2xl font-bold mb-6">Shipping Policy</h2>
                <div className="mb-6">
                  <img
                    src="/images/shipping/packaging.png"
                    alt="Sustainable Packaging"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Order Processing</h4>
                      <p className="text-muted-foreground text-sm">
                        Orders placed before 2:00 PM IST on business days are processed the same day. Orders placed
                        after 2:00 PM or on weekends/holidays are processed the next business day.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Tracking Information</h4>
                      <p className="text-muted-foreground text-sm">
                        Once your order is shipped, you'll receive a tracking number via email and SMS. You can track
                        your package in real-time using our order tracking system.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Delivery Attempts</h4>
                      <p className="text-muted-foreground text-sm">
                        Our courier partners will make up to 3 delivery attempts. If unsuccessful, the package will be
                        held at the local facility for 7 days before being returned to us.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold mb-2">Packaging</h4>
                      <p className="text-muted-foreground text-sm">
                        All products are carefully packaged using eco-friendly materials to ensure they arrive in
                        perfect condition while minimizing environmental impact.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
