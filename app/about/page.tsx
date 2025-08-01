"use client";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { fetchWebsiteImagesByType } from "@/lib/website-images-service"

interface WebsiteImage {
  _id: string;
  name: string;
  type: string;
  category?: string;
  imageUrl: string;
  altText: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AboutPage() {
  const [aboutImages, setAboutImages] = useState<WebsiteImage[]>([]);
  const [teamImages, setTeamImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [aboutData, teamData] = await Promise.all([
          fetchWebsiteImagesByType("about"),
          fetchWebsiteImagesByType("team")
        ]);
        
        setAboutImages(aboutData.filter(img => img.isActive));
        setTeamImages(teamData.filter(img => img.isActive));
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Get the first about image for the story section
  const storyImage = aboutImages.find(img => img.category === "story" || img.name.toLowerCase().includes("story")) || aboutImages[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto text-center">
            <h1 className="font-playfair text-4xl font-bold mb-4">About House of Evolve</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our story, mission, and commitment to sustainable fashion and conscious living.
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="space-y-12">
              {/* Our Story */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-6 text-center">Our Story</h2>
                <div className="mb-8">
                  {storyImage ? (
                    <img
                      src={storyImage.imageUrl}
                      alt={storyImage.altText}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">No story image available</p>
                    </div>
                  )}
                </div>
                <div className="prose prose-lg mx-auto text-muted-foreground">
                  <p className="text-center mb-8">
                    House of Evolve was born from a simple belief: fashion should be beautiful, ethical, and
                    sustainable. Founded in 2025, we started as a small team of designers and sustainability advocates
                    who wanted to create a brand that reflects our values and contributes positively to the world.
                  </p>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="font-playfair text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-muted-foreground">
                      To create beautiful, sustainable products that empower conscious consumers to make ethical choices
                      without compromising on style or quality.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">👁️</span>
                    </div>
                    <h3 className="font-playfair text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To become a leading sustainable lifestyle brand that inspires positive change in the fashion
                      industry and promotes conscious living worldwide.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Values */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Our Values</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">🌱</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Sustainability</h4>
                      <p className="text-sm text-muted-foreground">
                        Every decision we make considers its environmental impact, from sourcing to packaging.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">🤝</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Ethics</h4>
                      <p className="text-sm text-muted-foreground">
                        Fair trade practices, ethical sourcing, and respect for all stakeholders in our supply chain.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">✨</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Quality</h4>
                      <p className="text-sm text-muted-foreground">
                        We believe in creating products that last, reducing waste and maximizing value.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">🎨</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Design</h4>
                      <p className="text-sm text-muted-foreground">
                        Timeless, minimalist designs that transcend trends and remain relevant for years.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">🌍</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Community</h4>
                      <p className="text-sm text-muted-foreground">
                        Building a community of conscious consumers who care about the planet and each other.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-xl">🔄</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-2">Innovation</h4>
                      <p className="text-sm text-muted-foreground">
                        Continuously exploring new sustainable materials and production methods.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Team */}
              <div>
                <h2 className="font-playfair text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {teamImages.length > 0 ? (
                    teamImages.slice(0, 3).map((member, index) => (
                      <Card key={member._id}>
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                            <img
                              src={member.imageUrl}
                              alt={member.altText}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                          <p className="text-sm text-primary mb-2">{member.description || "Team Member"}</p>
                          <p className="text-xs text-muted-foreground">
                            {member.category || "Passionate about sustainable fashion and conscious living."}
                          </p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    // Fallback team members if no images are available
                    <>
                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-lg mb-1">Shubham</h4>
                          <p className="text-sm text-primary mb-2">Founder & CEO</p>
                          <p className="text-xs text-muted-foreground">
                            Passionate about sustainable fashion with 10+ years in the industry.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-lg mb-1">Sakshi</h4>
                          <p className="text-sm text-primary mb-2">Co-founder</p>
                          <p className="text-xs text-muted-foreground">
                            Focused on minimalist and sustainable aesthetics.
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 overflow-hidden">
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <span className="text-2xl">👤</span>
                            </div>
                          </div>
                          <h4 className="font-semibold text-lg mb-1">Kshitij</h4>
                          <p className="text-sm text-primary mb-2">Graphic Designer</p>
                          <p className="text-xs text-muted-foreground">
                            Graphic Designer ensuring our practices meet the highest standards.
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
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
