// @ts-nocheck
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { toast } from "sonner"

export function CMSManagement() {
  const [formData, setFormData] = useState({
    website: "https://carnage.com",
    instagram: "@carnage_lk",
    facebook: "Carnage Clothing",
    description: "Premium streetwear brand based in Sri Lanka.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Submit logic
    toast.success("Changes submitted for approval")
    console.log("Submitting CMS changes", formData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">App Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your merchant profile on the Koko app</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>App Profile Management</CardTitle>
          <CardDescription>Manage how your brand appears on the Koko app. Changes require approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Brand Visuals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Logo</Label>
                    <div className="h-32 w-32 rounded-xl bg-muted border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                      <PhotoIcon className="h-8 w-8 mb-2" />
                      <span className="text-xs font-medium">Upload Logo</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-md">
                    <Label>Cover Image</Label>
                    <div className="h-32 w-full rounded-xl bg-muted border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors cursor-pointer">
                      <PhotoIcon className="h-8 w-8 mb-2" />
                      <span className="text-xs font-medium">Upload Cover Image</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Contact & Socials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input id="website" name="website" value={formData.website} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram Handle</Label>
                    <Input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook Page</Label>
                    <Input id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Brand Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="description">Brand Description</Label>
                  <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
                  <p className="text-sm text-muted-foreground">Brief description displayed on your store profile.</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-[#BDDDEE] text-black hover:bg-[#BDDDEE]/90">
                Submit Changes for Approval
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
