"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, Mail, Phone, MapPin, Calendar, Building, Shield, Bell, 
  Eye, Lock, Trash2, Camera, Save, X, Check
} from "lucide-react"
import Link from "next/link"

// Sample user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+254 712 345 678",
  location: "Nairobi, Kenya",
  joinDate: "January 2024",
  avatar: "/user-avatar.jpg",
  verified: true,
  bio: "Real estate enthusiast looking for the perfect property in East Africa.",
  properties: {
    listed: 3,
    saved: 12,
    viewed: 45,
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  },
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    location: userData.location,
    bio: userData.bio,
  })
  const [preferences, setPreferences] = useState(userData.preferences)

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Saving profile:", formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      bio: userData.bio,
    })
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-stone-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-stone-200/50 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-stone-800">Nulo</span>
              <span className="text-amber-600">Africa</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-slate-700 hover:text-amber-600 transition-colors">
                Home
              </Link>
              <Link href="/properties" className="text-slate-700 hover:text-amber-600 transition-colors">
                Properties
              </Link>
              <Link href="/dashboard" className="text-slate-700 hover:text-amber-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="text-amber-600 font-semibold">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-5xl">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
            Profile & <span className="text-amber-600">Settings</span>
          </h1>
          <p className="text-lg text-slate-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-lg overflow-hidden">
            <CardContent className="p-8">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                {/* Avatar */}
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-amber-200">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-4xl font-semibold">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="h-8 w-8 text-white" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-slate-900">{userData.name}</h2>
                    {userData.verified && (
                      <Badge className="bg-green-100 text-green-700 border-0">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-600 mb-4">{userData.bio}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-amber-500" />
                      Joined {userData.joinDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      {userData.location}
                    </span>
                  </div>
                </div>

                {/* Edit Button */}
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-6 transition-all duration-300 hover:scale-105"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {/* Gold Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-8" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-3xl font-bold text-amber-600">{userData.properties.listed}</p>
                  <p className="text-sm text-slate-600 mt-1">Properties Listed</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-3xl font-bold text-amber-600">{userData.properties.saved}</p>
                  <p className="text-sm text-slate-600 mt-1">Saved Properties</p>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <p className="text-3xl font-bold text-amber-600">{userData.properties.viewed}</p>
                  <p className="text-sm text-slate-600 mt-1">Properties Viewed</p>
                </div>
              </div>

              {/* Gold Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-8" />

              {/* Editable Form */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-slate-800 transition-all ${
                          isEditing
                            ? "border-amber-300 bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            : "border-stone-200 bg-stone-50 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-slate-800 transition-all ${
                          isEditing
                            ? "border-amber-300 bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            : "border-stone-200 bg-stone-50 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-slate-800 transition-all ${
                          isEditing
                            ? "border-amber-300 bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            : "border-stone-200 bg-stone-50 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-slate-800 transition-all ${
                          isEditing
                            ? "border-amber-300 bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            : "border-stone-200 bg-stone-50 cursor-not-allowed"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-slate-800 transition-all resize-none ${
                      isEditing
                        ? "border-amber-300 bg-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        : "border-stone-200 bg-stone-50 cursor-not-allowed"
                    }`}
                  />
                </div>

                {/* Action Buttons (when editing) */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      className="flex-1 h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 h-12 border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications Preferences */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Bell className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Notification Preferences</h3>
                  <p className="text-sm text-slate-600">Manage how you receive updates</p>
                </div>
              </div>

              {/* Gold Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6" />

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-600">Receive updates via email</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      preferences.emailNotifications ? "bg-amber-500" : "bg-stone-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        preferences.emailNotifications ? "translate-x-7" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* SMS Notifications */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">SMS Notifications</p>
                    <p className="text-sm text-slate-600">Receive updates via SMS</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, smsNotifications: !preferences.smsNotifications })}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      preferences.smsNotifications ? "bg-amber-500" : "bg-stone-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        preferences.smsNotifications ? "translate-x-7" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-900">Marketing Emails</p>
                    <p className="text-sm text-slate-600">Receive promotional content</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, marketingEmails: !preferences.marketingEmails })}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                      preferences.marketingEmails ? "bg-amber-500" : "bg-stone-300"
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        preferences.marketingEmails ? "translate-x-7" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Actions */}
          <Card className="bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-amber-100 rounded-xl">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Security & Privacy</h3>
                  <p className="text-sm text-slate-600">Manage your account security</p>
                </div>
              </div>

              {/* Gold Divider */}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-6" />

              <div className="space-y-3">
                {/* Change Password */}
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300"
                >
                  <Lock className="h-5 w-5 mr-3 text-amber-600" />
                  Change Password
                </Button>

                {/* Privacy Settings */}
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start border-2 border-stone-200 hover:border-amber-400 hover:bg-amber-50 text-slate-800 rounded-xl font-semibold transition-all duration-300"
                >
                  <Eye className="h-5 w-5 mr-3 text-amber-600" />
                  Privacy Settings
                </Button>

                {/* Gold Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-400 to-transparent my-6" />

                {/* Delete Account */}
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-600 rounded-xl font-semibold transition-all duration-300"
                >
                  <Trash2 className="h-5 w-5 mr-3" />
                  Delete Account
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-stone-200/50 py-8 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-600">
            © 2025 <span className="font-semibold text-slate-900">NuloAfrica</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
