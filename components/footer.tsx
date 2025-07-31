import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-playfair text-xl font-bold">House of Evolve</h3>
            <p className="text-sm opacity-90">
              Sustainable lifestyle brand committed to conscious living and minimalist elegance.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="opacity-90 hover:opacity-100">
                  All Products
                </Link>
              </li>
              <li>
                            <Link href="/category/jewellery" className="opacity-90 hover:opacity-100">
              Jewelry
            </Link>
              </li>
              <li>
                <Link href="/category/sportswear" className="opacity-90 hover:opacity-100">
                  Sportswear
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="opacity-90 hover:opacity-100">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="opacity-90 hover:opacity-100">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="opacity-90 hover:opacity-100">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="opacity-90 hover:opacity-100">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="opacity-90 hover:opacity-100">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/careers" className="opacity-90 hover:opacity-100">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} House of Evolve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
