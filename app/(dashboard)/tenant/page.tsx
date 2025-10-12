"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, Heart, MessageSquare, Calendar, FileText, DollarSign, Bell, Search, MapPin, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"

const recentViewed = [
  {
    id: 1,
    title: "Modern Villa in Nairobi",
    location: "Westlands, Nairobi",
    price: "$2,500/month",
    image: "/modern-villa-nairobi.jpg",
    beds: 4,
    baths: 3,
    sqft: "3,200",
  },
  {
    id: 2,
    title: "Luxury Apartment Lagos",
    location: "Victoria Island, Lagos",
    price: "$1,800/month",
    image: "/luxury-apartment-lagos.jpg",
    beds: 3,
    baths: 2,
    sqft: "2,100",
  },
]

const upcomingPayments = [
  {
    property: "Modern Villa in Nairobi",
    amount: "$2,500",
    dueDate: "Jan 1, 2025",
    status: "upcoming",
  },
  {
    property: "Luxury Apartment Lagos",
    amount: "$1,800",
    dueDate: "Dec 15, 2024",
    status: "paid",
  },
]

const maintenanceRequests = [
  {
    id: 1,
    title: "Leaking Faucet",
    property: "Modern Villa in Nairobi",
    status: "in-progress",
    date: "Dec 10, 2024",
  },
  {
    id: 2,
    title: "AC Not Working",
    property: "Luxury Apartment Lagos",
    status: "pending",
    date: "Dec 8, 2024",
  },
]

export default function TenantDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* <Header /> */}

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Welcome back, John!</h1>
          <p className="text-slate-600">Manage your rentals and stay updated</p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/90 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Rentals</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3">
                  <Home className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Saved Properties</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3">
                  <Heart className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Messages</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">5</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3">
                  <MessageSquare className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-white/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Upcoming Payment</p>
                  <p className="mt-2 text-3xl font-bold text-amber-600">$2,500</p>
                </div>
                <div className="rounded-lg bg-amber-100 p-3">
                  <DollarSign className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recently Viewed Properties */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Recently Viewed</CardTitle>
                  <Link href="/properties">
                    <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentViewed.map((property) => (
                    <div key={property.id} className="flex gap-4 p-4 rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all">
                      <img
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        className="h-24 w-32 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{property.title}</h3>
                        <p className="text-sm text-slate-600 flex items-center mb-2">
                          <MapPin className="h-3 w-3 mr-1 text-amber-500" />
                          {property.location}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3 text-amber-500" />
                            {property.beds}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3 text-amber-500" />
                            {property.baths}
                          </span>
                          <span className="flex items-center gap-1">
                            <Square className="h-3 w-3 text-amber-500" />
                            {property.sqft} sqft
                          </span>
                        </div>
                        <p className="text-lg font-bold text-amber-600">{property.price}</p>
                      </div>
                      <Link href={`/properties/${property.id}`}>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Requests */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-slate-900">Maintenance Requests</CardTitle>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {maintenanceRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-amber-300 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{request.title}</h4>
                        <p className="text-sm text-slate-600">{request.property}</p>
                        <p className="text-xs text-slate-500 mt-1">{request.date}</p>
                      </div>
                      <Badge
                        className={
                          request.status === "in-progress"
                            ? "bg-amber-100 text-amber-700 border-0"
                            : "bg-slate-100 text-slate-700 border-0"
                        }
                      >
                        {request.status === "in-progress" ? "In Progress" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Upcoming Payments */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-slate-900">Upcoming Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingPayments.map((payment, index) => (
                    <div key={index} className="p-4 rounded-xl border border-stone-200">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-medium text-slate-900">{payment.property}</p>
                        <Badge
                          className={
                            payment.status === "paid"
                              ? "bg-green-100 text-green-700 border-0"
                              : "bg-amber-100 text-amber-700 border-0"
                          }
                        >
                          {payment.status === "paid" ? "Paid" : "Due"}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-slate-900 mb-1">{payment.amount}</p>
                      <p className="text-xs text-slate-600">Due: {payment.dueDate}</p>
                      {payment.status === "upcoming" && (
                        <Button size="sm" className="w-full mt-3 bg-amber-500 hover:bg-amber-600 text-white">
                          Pay Now
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/50">
              <CardHeader>
                <CardTitle className="text-slate-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/properties">
                    <Button variant="outline" className="w-full justify-start border-slate-300 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600">
                      <Search className="mr-2 h-4 w-4" />
                      Browse Properties
                    </Button>
                  </Link>
                  <Link href="/dashboard/favorites">
                    <Button variant="outline" className="w-full justify-start border-slate-300 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600">
                      <Heart className="mr-2 h-4 w-4" />
                      View Favorites
                    </Button>
                  </Link>
                  <Link href="/dashboard/messages">
                    <Button variant="outline" className="w-full justify-start border-slate-300 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start border-slate-300 hover:bg-amber-50 hover:border-amber-500 hover:text-amber-600">
                    <FileText className="mr-2 h-4 w-4" />
                    View Lease
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
