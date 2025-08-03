import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="space-y-3 sm:space-y-4 col-span-2 sm:col-span-1">
            <h3 className="font-playfair text-lg sm:text-xl font-bold">House of Evolve</h3>
            <p className="text-xs sm:text-sm opacity-90">
              Sustainable lifestyle brand committed to conscious living and minimalist elegance.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-sm sm:text-base">Shop</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
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

          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-sm sm:text-base">Support</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
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

          <div className="space-y-3 sm:space-y-4">
            <h4 className="font-semibold text-sm sm:text-base">Company</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
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

        <div className="border-t border-primary-foreground/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} House of Evolve. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
