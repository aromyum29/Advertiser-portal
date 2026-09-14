// @ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline"

// Mock data for history
const mockHistory = [
  { id: "REQ-001", date: "2024-01-15", items: "X-Banner (1), Door Sticker (2)", status: "Completed" },
  { id: "REQ-002", date: "2024-02-01", items: "Tabletop (5)", status: "Pending" },
  { id: "REQ-003", date: "2024-02-10", items: "X-Banner (2)", status: "Completed" },
]

export function BrandingRequests() {
  const [counts, setCounts] = useState({
    "X-Banner": 0,
    "Door Sticker": 0,
    "Tabletop": 0
  })

  const updateCount = (item: string, delta: number) => {
    setCounts(prev => ({
      ...prev,
      [item]: Math.max(0, (prev[item as keyof typeof prev] || 0) + delta)
    }))
  }

  const handleSubmit = () => {
    // Implement submit logic
    console.log("Submitting", counts)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Branding Requests</h1>
        <p className="text-muted-foreground mt-1">Order in-store marketing materials</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request In-Store Branding</CardTitle>
          <CardDescription>Select the branding materials you need for your store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {Object.keys(counts).map((item) => (
              <div key={item} className="rounded-xl border border-border/50 shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#BDDCEE] to-[#EDD8F8]"></div>
                <div className="flex flex-col gap-3 p-4 bg-card">
                  <span className="font-medium text-lg">{item}</span>
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-1">
                    <Button variant="outline" size="icon" onClick={() => updateCount(item, -1)} className="h-8 w-8">
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="font-semibold text-lg w-12 text-center">{counts[item as keyof typeof counts]}</span>
                    <Button variant="default" size="icon" onClick={() => updateCount(item, 1)} className="h-8 w-8">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmit} 
              className="bg-[#BDDDEE] text-black hover:bg-[#BDDDEE]/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={Object.values(counts).every(count => count === 0)}
            >
              Submit Request
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>View the status of your previous requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHistory.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.id}</TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>{req.items}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        req.status === "Pending" 
                          ? "bg-orange-500 hover:bg-orange-600 border-transparent text-white" 
                          : "bg-green-500 hover:bg-green-600 border-transparent text-white"
                      }
                    >
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
