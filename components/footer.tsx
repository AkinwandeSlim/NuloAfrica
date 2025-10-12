import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-amber-50 via-white to-stone-50 border-t border-stone-200">
      <div className="container mx-auto px-4 py-16">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h3 className="mb-4 text-2xl font-bold text-slate-900">Stay Updated</h3>
          <p className="mb-6 text-slate-600">Get the latest property listings and market insights delivered to your inbox</p>
          <div className="mx-auto flex max-w-md gap-2">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 border-stone-300 focus:border-amber-500 focus:ring-amber-500/20"
            />
            <Button className="bg-amber-500 text-white hover:bg-amber-600">
              <Mail className="mr-2 h-4 w-4" />
              Subscribe
            </Button>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold">
              <span className="text-slate-800">Nulo</span>
              <span className="text-amber-600">Africa</span>
            </div>
            <p className="mb-4 text-sm text-slate-600 leading-relaxed">
              Your trusted partner in finding the perfect home across Africa.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-500 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Rent</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/properties" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Apartments for Rent
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Houses for Rent
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  All Cities
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-slate-900">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-amber-600 transition-colors duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-stone-200 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Nulo Africa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
