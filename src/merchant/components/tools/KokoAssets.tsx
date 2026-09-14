// @ts-nocheck
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

export function KokoAssets() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Koko Assets</h1>
        <p className="text-muted-foreground mt-1">Marketing materials and brand resources</p>
      </div>

    <Card className="max-w-2xl mx-auto shadow-sm border border-border/50">
      <CardHeader>
        <CardTitle>Online Koko Assets</CardTitle>
        <CardDescription>Access our shared library of marketing assets for your online channels.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-10 space-y-6 text-center">
        <div className="h-20 w-20 bg-[#BDDDEE]/20 rounded-full flex items-center justify-center">
          <ArrowTopRightOnSquareIcon className="h-10 w-10 text-[#BDDDEE]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Marketing Asset Drive</h3>
          <p className="text-muted-foreground">Find logos, banners, social media templates, and guidebooks.</p>
        </div>
        <Button 
          className="bg-[#BDDDEE] text-black hover:bg-[#BDDDEE]/90 w-full max-w-sm"
          onClick={() => window.open('https://drive.google.com/drive/', '_blank')}
        >
          Open Asset Drive
          <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
    </div>
  )
}
