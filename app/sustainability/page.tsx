import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Recycle, Heart, Globe } from "lucide-react"

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="font-playfair text-4xl font-bold mb-4">Our Sustainability Commitment</h1>
                <p className="text-lg text-muted-foreground">
                  Learn about our environmental initiatives and how we're working to create a more sustainable future.
                </p>
              </div>
              <div>
                <img
                  src="/images/sustainability/eco-materials.png"
                  alt="Sustainable Materials"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Our Approach */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Our Approach</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Leaf className="h-6 w-6 text-green-600" />
                        Sustainable Materials
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        We carefully select eco-friendly materials that minimize environmental impact while maintaining
                        quality and durability.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Organic cotton and hemp fibers</li>
                        <li>• Recycled metals for jewelry</li>
                        <li>• Biodegradable packaging materials</li>
                        <li>• Water-based dyes and finishes</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Recycle className="h-6 w-6 text-blue-600" />
                        Circular Economy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        We design products with their entire lifecycle in mind, from creation to disposal and beyond.
                      </p>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Durable designs that last for years</li>
                        <li>• Repair and upcycling services</li>
                        <li>• Take-back program for old items</li>
                        <li>• Minimal waste production processes</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Environmental Impact */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Environmental Impact</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-green-600 mb-2">75%</div>
                      <p className="text-sm font-medium mb-2">Reduction in Water Usage</p>
                      <p className="text-xs text-muted-foreground">Compared to conventional production methods</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-blue-600 mb-2">90%</div>
                      <p className="text-sm font-medium mb-2">Recyclable Packaging</p>
                      <p className="text-xs text-muted-foreground">
                        All our packaging materials are recyclable or compostable
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                      <p className="text-sm font-medium mb-2">Renewable Energy</p>
                      <p className="text-xs text-muted-foreground">
                        Our facilities run on clean, renewable energy sources
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Certifications & Partnerships</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-4">Our Certifications</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">GOTS Certified</Badge>
                          <span className="text-sm text-muted-foreground">Global Organic Textile Standard</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Fair Trade</Badge>
                          <span className="text-sm text-muted-foreground">Ethical sourcing and fair wages</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">B-Corp</Badge>
                          <span className="text-sm text-muted-foreground">Certified B Corporation</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">Carbon Neutral</Badge>
                          <span className="text-sm text-muted-foreground">Net-zero carbon emissions</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-4">Our Partners</h4>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                          • <strong>1% for the Planet:</strong> We donate 1% of annual sales to environmental causes
                        </p>
                        <p>
                          • <strong>Textile Exchange:</strong> Member of the global textile sustainability organization
                        </p>
                        <p>
                          • <strong>Fashion Revolution:</strong> Supporting transparency in the fashion industry
                        </p>
                        <p>
                          • <strong>Ellen MacArthur Foundation:</strong> Committed to circular economy principles
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Supply Chain */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Ethical Supply Chain</h2>
                <Card>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="text-center">
                        <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h4 className="font-semibold text-lg mb-2">Fair Labor</h4>
                        <p className="text-sm text-muted-foreground">
                          All our partners provide fair wages, safe working conditions, and respect workers' rights.
                        </p>
                      </div>

                      <div className="text-center">
                        <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                        <h4 className="font-semibold text-lg mb-2">Local Sourcing</h4>
                        <p className="text-sm text-muted-foreground">
                          We prioritize local suppliers to reduce transportation emissions and support communities.
                        </p>
                      </div>

                      <div className="text-center">
                        <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <h4 className="font-semibold text-lg mb-2">Transparency</h4>
                        <p className="text-sm text-muted-foreground">
                          Full traceability of our supply chain from raw materials to finished products.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Future Goals */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">2025 Goals</h2>
                <div className="space-y-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">Carbon Negative Operations</h4>
                          <p className="text-sm text-muted-foreground">Remove more carbon than we produce</p>
                        </div>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">Zero Waste to Landfill</h4>
                          <p className="text-sm text-muted-foreground">100% of waste recycled or composted</p>
                        </div>
                        <Badge variant="secondary">Planned</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold mb-1">Regenerative Materials</h4>
                          <p className="text-sm text-muted-foreground">50% of materials from regenerative sources</p>
                        </div>
                        <Badge variant="secondary">Research Phase</Badge>
                      </div>
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
