"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Home, MessageSquare, Settings, MapPin, Bed, Bath, Square, Eye, Clock, Bell, Search, Menu, X, LayoutDashboard, Building2, TrendingUp } from "lucide-react"
import Link from "next/link"

const savedProperties = [
  {
    id: 1,
    title: "Modern Villa in Nairobi",
    location: "Westlands, Nairobi",
    price: "$450,000",
    beds: 4,
    baths: 3,
    sqft: "3,200",
    image: "/modern-villa-nairobi.jpg",
  },
  {
    id: 2,
    title: "Luxury Apartment Lagos",
    location: "Victoria Island, Lagos",
    price: "$320,000",
    beds: 3,
    baths: 2,
    sqft: "2,100",
    image: "/luxury-apartment-lagos.jpg",
  },
]

const activeListings = [
  {
    id: 1,
    title: "Cozy Apartment in Accra",
    location: "East Legon, Accra",
    price: "$180,000",
    status: "Active",
    views: 234,
    inquiries: 12,
    image: "/apartment-accra.jpg",
  },
]

const messages = [
  {
    id: 1,
    name: "John Mensah",
    message: "Hi, I'm interested in viewing the property this weekend.",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    name: "Sarah Okonkwo",
    message: "Is the price negotiable?",
    time: "1 day ago",
    unread: false,
  },
  {
    id: 3,
    name: "Michael Banda",
    message: "Thank you for the quick response!",
    time: "3 days ago",
    unread: false,
  },
]

const recentActivity = [
  {
    id: 1,
    type: "view",
    property: "Modern Villa in Nairobi",
    user: "Sarah Johnson",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "inquiry",
    property: "Luxury Apartment Lagos",
    user: "Michael Chen",
    time: "5 hours ago",
  },
  {
    id: 3,
    type: "favorite",
    property: "Cozy Apartment in Accra",
    user: "Emma Williams",
    time: "1 day ago",
  },
]

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                <span className="text-stone-800">Nulo</span>
                <span className="text-amber-600">Africa</span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search properties..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-stone-200 bg-white/60 backdrop-blur-sm text-slate-800 placeholder:text-slate-500 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20 transition-all duration-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-700" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
            </Button>
            <Avatar className="h-10 w-10 border-2 border-amber-200 cursor-pointer hover:border-amber-400 transition-colors">
              <AvatarImage src="/user-profile.jpg" />
              <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 z-40 w-64 bg-white/90 backdrop-blur-xl border-r border-stone-200/50 shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <nav className="flex-1 space-y-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "home"
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-slate-700 hover:bg-stone-100"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "listings"
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-slate-700 hover:bg-stone-100"
              }`}
            >
              <Building2 className="h-5 w-5" />
              <span>Listings</span>
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "messages"
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-slate-700 hover:bg-stone-100"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Messages</span>
              <Badge className="ml-auto bg-amber-500 text-white text-xs">
                {messages.filter((m) => m.unread).length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "favorites"
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-slate-700 hover:bg-stone-100"
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Favorites</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === "settings"
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-slate-700 hover:bg-stone-100"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </nav>

          <div className="pt-6 border-t border-stone-200">
            <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
              <p className="text-sm font-semibold text-slate-800 mb-1">Upgrade to Pro</p>
              <p className="text-xs text-slate-600 mb-3">Get unlimited listings</p>
              <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-20 lg:pl-64 min-h-screen">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {activeTab === "home" && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Welcome back, John!
                </h1>
                <p className="text-slate-600">Here's what's happening with your properties</p>
              </div>

              {/* Stats Cards */}
              <div className="mb-10 grid gap-6 md:grid-cols-3">
                <Card className="group bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Saved Properties</p>
                        <p className="text-4xl font-bold text-slate-900">{savedProperties.length}</p>
                      </div>
                      <div className="p-4 bg-amber-100 rounded-xl">
                        <Heart className="h-7 w-7 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Active Listings</p>
                        <p className="text-4xl font-bold text-slate-900">{activeListings.length}</p>
                      </div>
                      <div className="p-4 bg-amber-100 rounded-xl">
                        <Building2 className="h-7 w-7 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">Unread Messages</p>
                        <p className="text-4xl font-bold text-slate-900">{messages.filter((m) => m.unread).length}</p>
                      </div>
                      <div className="p-4 bg-amber-100 rounded-xl">
                        <MessageSquare className="h-7 w-7 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Saved Properties Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Saved Properties</h2>
                  <Link href="/properties">
                    <Button variant="ghost" className="text-amber-600 hover:text-amber-700">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {savedProperties.map((property) => (
                    <Card key={property.id} className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-5">
                        <div className="flex gap-4">
                          <img
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            className="w-32 h-32 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 mb-1">{property.title}</h3>
                            <p className="flex items-center text-sm text-slate-600 mb-3">
                              <MapPin className="mr-1 h-3 w-3" />
                              {property.location}
                            </p>
                            <div className="flex gap-4 text-sm text-slate-600 mb-3">
                              <span className="flex items-center">
                                <Bed className="mr-1 h-4 w-4" />
                                {property.beds}
                              </span>
                              <span className="flex items-center">
                                <Bath className="mr-1 h-4 w-4" />
                                {property.baths}
                              </span>
                              <span className="flex items-center">
                                <Square className="mr-1 h-4 w-4" />
                                {property.sqft} sqft
                              </span>
                            </div>
                            <p className="text-lg font-bold text-amber-600">{property.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Messages Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Recent Messages</h2>
                  <Button variant="ghost" className="text-amber-600 hover:text-amber-700" onClick={() => setActiveTab("messages")}>
                    View All
                  </Button>
                </div>
                <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {messages.slice(0, 3).map((message) => (
                        <div
                          key={message.id}
                          className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                        >
                          <Avatar>
                            <AvatarFallback className="bg-amber-100 text-amber-700">
                              {message.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-slate-900">{message.name}</h4>
                              <span className="flex items-center text-xs text-slate-500">
                                <Clock className="mr-1 h-3 w-3" />
                                {message.time}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{message.message}</p>
                          </div>
                          {message.unread && <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            {activity.type === "view" && <Eye className="h-4 w-4 text-amber-600" />}
                            {activity.type === "inquiry" && <MessageSquare className="h-4 w-4 text-amber-600" />}
                            {activity.type === "favorite" && <Heart className="h-4 w-4 text-amber-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">
                              <span className="font-semibold">{activity.user}</span> {activity.type === "view" ? "viewed" : activity.type === "inquiry" ? "inquired about" : "favorited"} <span className="font-semibold">{activity.property}</span>
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeTab === "listings" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Your Listings</h1>
                  <p className="text-slate-600">Manage your property listings</p>
                </div>
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  Add New Listing
                </Button>
              </div>
              <div className="space-y-6">
                {activeListings.map((listing) => (
                  <Card key={listing.id} className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-48 h-32 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-slate-900 text-lg">{listing.title}</h3>
                            <Badge className="bg-green-100 text-green-700 border-0">
                              {listing.status}
                            </Badge>
                          </div>
                          <p className="flex items-center text-sm text-slate-600 mb-3">
                            <MapPin className="mr-1 h-3 w-3" />
                            {listing.location}
                          </p>
                          <p className="text-xl font-bold text-amber-600 mb-4">{listing.price}</p>
                          <div className="flex gap-6 text-sm text-slate-600">
                            <span className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              {listing.views} views
                            </span>
                            <span className="flex items-center">
                              <MessageSquare className="mr-1 h-4 w-4" />
                              {listing.inquiries} inquiries
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Messages</h1>
              <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                            {message.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-slate-900">{message.name}</h4>
                            <span className="flex items-center text-xs text-slate-500">
                              <Clock className="mr-1 h-3 w-3" />
                              {message.time}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{message.message}</p>
                        </div>
                        {message.unread && <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Favorite Properties</h1>
              <div className="grid gap-6 md:grid-cols-2">
                {savedProperties.map((property) => (
                  <Card key={property.id} className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <img
                          src={property.image || "/placeholder.svg"}
                          alt={property.title}
                          className="w-32 h-32 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">{property.title}</h3>
                          <p className="flex items-center text-sm text-slate-600 mb-3">
                            <MapPin className="mr-1 h-3 w-3" />
                            {property.location}
                          </p>
                          <div className="flex gap-4 text-sm text-slate-600 mb-3">
                            <span className="flex items-center">
                              <Bed className="mr-1 h-4 w-4" />
                              {property.beds}
                            </span>
                            <span className="flex items-center">
                              <Bath className="mr-1 h-4 w-4" />
                              {property.baths}
                            </span>
                            <span className="flex items-center">
                              <Square className="mr-1 h-4 w-4" />
                              {property.sqft} sqft
                            </span>
                          </div>
                          <p className="text-lg font-bold text-amber-600">{property.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Account Settings</h1>
              <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-sm max-w-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-amber-100 text-amber-700 text-2xl font-semibold">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">John Doe</h3>
                      <p className="text-sm text-slate-600">john.doe@example.com</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-slate-800 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-slate-800 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+254 712 345 678"
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-white text-slate-800 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/20 transition-all"
                      />
                    </div>
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white mt-6">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
