import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Users, MessageSquare, TrendingUp, Eye, Heart, DollarSign, Edit, Trash2 } from "lucide-react"

const stats = [
  {
    title: "Total Properties",
    value: "1,234",
    change: "+12%",
    icon: Home,
  },
  {
    title: "Active Users",
    value: "8,456",
    change: "+23%",
    icon: Users,
  },
  {
    title: "Total Inquiries",
    value: "3,789",
    change: "+8%",
    icon: MessageSquare,
  },
  {
    title: "Revenue",
    value: "$124,500",
    change: "+15%",
    icon: DollarSign,
  },
]

const recentListings = [
  {
    id: 1,
    title: "Modern Villa in Nairobi",
    location: "Westlands, Nairobi",
    price: "$450,000",
    status: "Active",
    views: 234,
    likes: 45,
  },
  {
    id: 2,
    title: "Luxury Apartment Lagos",
    location: "Victoria Island, Lagos",
    price: "$320,000",
    status: "Pending",
    views: 189,
    likes: 32,
  },
  {
    id: 3,
    title: "Beachfront Property",
    location: "Diani Beach, Kenya",
    price: "$680,000",
    status: "Active",
    views: 456,
    likes: 78,
  },
]

const recentUsers = [
  {
    id: 1,
    name: "Amara Okafor",
    email: "amara.okafor@example.com",
    joined: "2024-01-15",
    status: "Active",
  },
  {
    id: 2,
    name: "David Kimani",
    email: "david.kimani@example.com",
    joined: "2024-01-14",
    status: "Active",
  },
  {
    id: 3,
    name: "Sarah Mensah",
    email: "sarah.mensah@example.com",
    joined: "2024-01-13",
    status: "Active",
  },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform and monitor analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">{stat.change} from last month</p>
                  </div>
                  <div className="rounded-lg bg-accent/10 p-3">
                    <stat.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">Property Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Property Listings</h2>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Add New Property</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Property</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Engagement</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{listing.title}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{listing.location}</td>
                          <td className="px-6 py-4 font-semibold text-accent">{listing.price}</td>
                          <td className="px-6 py-4">
                            <Badge
                              className={
                                listing.status === "Active"
                                  ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                  : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                              }
                            >
                              {listing.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Eye className="mr-1 h-4 w-4" />
                                {listing.views}
                              </span>
                              <span className="flex items-center">
                                <Heart className="mr-1 h-4 w-4" />
                                {listing.likes}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">User Management</h2>
              <Button variant="outline">Export Users</Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Joined</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                          <td className="px-6 py-4">
                            <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">{user.status}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Platform Analytics</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Property Views Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                    <TrendingUp className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                    <Users className="h-12 w-12 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
