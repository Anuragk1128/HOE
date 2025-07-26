import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Users, Heart } from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "Senior Fashion Designer",
      department: "Design",
      location: "Mumbai, India",
      type: "Full-time",
      description: "Lead our design team in creating sustainable and innovative fashion pieces.",
    },
    {
      title: "Sustainability Manager",
      department: "Operations",
      location: "Remote",
      type: "Full-time",
      description: "Drive our sustainability initiatives and ensure compliance with environmental standards.",
    },
    {
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Bangalore, India",
      type: "Full-time",
      description: "Develop and execute digital marketing strategies to grow our brand presence.",
    },
    {
      title: "Supply Chain Coordinator",
      department: "Operations",
      location: "Delhi, India",
      type: "Full-time",
      description: "Manage relationships with suppliers and ensure ethical sourcing practices.",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">Join Our Team</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Be part of a mission-driven team that's creating positive change in the fashion industry.
            </p>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Why Work With Us</h2>
            <div className="mb-8">
              <img
                src="/images/careers/team-work.png"
                alt="Our Team at Work"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Heart className="h-6 w-6 text-red-500" />
                    Purpose-Driven Work
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every day, you'll contribute to creating a more sustainable and ethical fashion industry. Your work
                    has real impact on the environment and communities worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-500" />
                    Collaborative Culture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join a diverse, inclusive team where every voice matters. We believe in open communication,
                    continuous learning, and supporting each other's growth.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div className="mb-12">
              <h3 className="font-playfair text-2xl font-bold mb-6 text-center">Benefits & Perks</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">🏥</span>
                    </div>
                    <h4 className="font-semibold mb-2">Health & Wellness</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive health insurance, mental health support, and wellness programs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">⚖️</span>
                    </div>
                    <h4 className="font-semibold mb-2">Work-Life Balance</h4>
                    <p className="text-sm text-muted-foreground">
                      Flexible working hours, remote work options, and generous paid time off.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">📚</span>
                    </div>
                    <h4 className="font-semibold mb-2">Learning & Growth</h4>
                    <p className="text-sm text-muted-foreground">
                      Professional development budget, conference attendance, and skill-building workshops.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">💰</span>
                    </div>
                    <h4 className="font-semibold mb-2">Competitive Package</h4>
                    <p className="text-sm text-muted-foreground">
                      Competitive salary, performance bonuses, and equity participation program.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">🛍️</span>
                    </div>
                    <h4 className="font-semibold mb-2">Product Discounts</h4>
                    <p className="text-sm text-muted-foreground">
                      Generous employee discounts on all House of Evolve products.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl">🌱</span>
                    </div>
                    <h4 className="font-semibold mb-2">Sustainability Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Contribute to environmental initiatives and see the direct impact of your work.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Current Openings */}
            <div>
              <h3 className="font-playfair text-2xl font-bold mb-6 text-center">Current Openings</h3>
              <div className="space-y-4">
                {jobOpenings.map((job, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">{job.title}</h4>
                            <Badge variant="secondary">{job.department}</Badge>
                          </div>
                          <p className="text-muted-foreground text-sm mb-3">{job.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {job.type}
                            </div>
                          </div>
                        </div>
                        <Button>Apply Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* No Openings Message */}
            <Card className="mt-8 bg-muted/50">
              <CardContent className="p-8 text-center">
                <h3 className="font-semibold text-lg mb-2">Don't See a Perfect Match?</h3>
                <p className="text-muted-foreground mb-4">
                  We're always looking for talented individuals who share our values. Send us your resume and we'll keep
                  you in mind for future opportunities.
                </p>
                <Button asChild variant="outline">
                  <Link href="/contact">Send Your Resume</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
