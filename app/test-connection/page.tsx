"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

export default function TestConnectionPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<any>(null)

  const runTests = async () => {
    setTesting(true)
    const testResults: any = {
      envVars: {},
      connection: {},
      auth: {},
      database: {},
    }

    // Test 1: Check environment variables
    testResults.envVars = {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...' || 'NOT SET',
    }

    // Test 2: Test basic connection
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      testResults.connection = {
        success: !error,
        error: error?.message,
        data: data,
      }
    } catch (error: any) {
      testResults.connection = {
        success: false,
        error: error.message,
      }
    }

    // Test 3: Test auth service
    try {
      const { data, error } = await supabase.auth.getSession()
      testResults.auth = {
        success: !error,
        error: error?.message,
        hasSession: !!data.session,
      }
    } catch (error: any) {
      testResults.auth = {
        success: false,
        error: error.message,
      }
    }

    // Test 4: Test database query
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .limit(1)
      
      testResults.database = {
        success: !error,
        error: error?.message,
        propertyCount: data?.length || 0,
      }
    } catch (error: any) {
      testResults.database = {
        success: false,
        error: error.message,
      }
    }

    setResults(testResults)
    setTesting(false)
  }

  const getStatusIcon = (success: boolean) => {
    if (success) return <CheckCircle className="h-5 w-5 text-green-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-warm-ivory-gradient p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Supabase Connection Test</h1>
          <p className="text-stone-600">Diagnose connection issues with your Supabase backend</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Run Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runTests}
              disabled={testing}
              className="bg-[#FF6600] hover:bg-[#FF6600]/90"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Run Tests'
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Environment Variables</CardTitle>
                  {results.envVars.url && results.envVars.anonKey ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Configured</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-0">Missing</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div>
                    <p className="font-medium text-stone-900">NEXT_PUBLIC_SUPABASE_URL</p>
                    <p className="text-sm text-stone-600 font-mono">{results.envVars.urlValue}</p>
                  </div>
                  {getStatusIcon(results.envVars.url)}
                </div>
                <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div>
                    <p className="font-medium text-stone-900">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                    <p className="text-sm text-stone-600 font-mono">{results.envVars.anonKeyPreview}</p>
                  </div>
                  {getStatusIcon(results.envVars.anonKey)}
                </div>
              </CardContent>
            </Card>

            {/* Connection Test */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Database Connection</CardTitle>
                  {results.connection.success ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Connected</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {results.connection.success ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span>Successfully connected to Supabase database</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      <span>Failed to connect to database</span>
                    </div>
                    {results.connection.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-mono">{results.connection.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Auth Service Test */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Authentication Service</CardTitle>
                  {results.auth.success ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Working</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {results.auth.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span>Auth service is accessible</span>
                    </div>
                    <p className="text-sm text-stone-600">
                      Session status: {results.auth.hasSession ? 'Logged in' : 'Not logged in'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      <span>Auth service unavailable</span>
                    </div>
                    {results.auth.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-mono">{results.auth.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Database Query Test */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Database Queries</CardTitle>
                  {results.database.success ? (
                    <Badge className="bg-green-100 text-green-700 border-0">Working</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {results.database.success ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span>Can query database tables</span>
                    </div>
                    <p className="text-sm text-stone-600">
                      Found {results.database.propertyCount} properties in database
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      <span>Cannot query database</span>
                    </div>
                    {results.database.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-mono">{results.database.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-[#FF6600]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[#FF6600]" />
                  <CardTitle>Troubleshooting Steps</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {!results.envVars.url || !results.envVars.anonKey ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-900 mb-2">❌ Environment variables not set</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800">
                      <li>Create <code className="bg-orange-100 px-1 rounded">.env.local</code> file in <code className="bg-orange-100 px-1 rounded">client/</code> folder</li>
                      <li>Add your Supabase URL and anon key</li>
                      <li>Restart the dev server</li>
                    </ol>
                  </div>
                ) : !results.connection.success ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-900 mb-2">❌ Cannot connect to Supabase</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800">
                      <li>Check if your Supabase project is active (not paused)</li>
                      <li>Verify your internet connection</li>
                      <li>Check Supabase status: <a href="https://status.supabase.com" className="underline">status.supabase.com</a></li>
                      <li>Verify your Supabase URL is correct</li>
                    </ol>
                  </div>
                ) : !results.auth.success ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-900 mb-2">❌ Auth service not accessible</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800">
                      <li>Check if auth is enabled in Supabase dashboard</li>
                      <li>Verify your anon key is correct</li>
                      <li>Check CORS settings in Supabase</li>
                    </ol>
                  </div>
                ) : !results.database.success ? (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="font-medium text-orange-900 mb-2">❌ Database queries failing</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-orange-800">
                      <li>Run the database setup SQL scripts</li>
                      <li>Check RLS policies are configured</li>
                      <li>Verify tables exist in Supabase</li>
                    </ol>
                  </div>
                ) : (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="font-medium text-green-900 mb-2">✅ All tests passed!</p>
                    <p className="text-sm text-green-800">Your Supabase connection is working correctly. You can now use the app.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
