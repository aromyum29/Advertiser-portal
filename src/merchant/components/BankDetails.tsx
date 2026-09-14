// @ts-nocheck
import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Separator } from "./ui/separator"
import { UploadCloud, FileText, AlertCircle, Info } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

// Mock current bank details
const initialBankDetails = {
  accountName: "Koko Retail Pvt Ltd",
  bankName: "Commercial Bank",
  branchName: "Kollupitiya",
  accountNumber: "8120349123"
}

export function BankDetails() {
  const [isEditing, setIsEditing] = useState(false)
  const [currentDetails, setCurrentDetails] = useState(initialBankDetails)
  const [formData, setFormData] = useState(initialBankDetails)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setUploadedFile(e.target.files[0])
    }
  }

  const handleSave = () => {
    // Validation
    if (!formData.accountName || !formData.bankName || !formData.branchName || !formData.accountNumber) {
        toast.error("Please fill in all bank details")
        return
    }
    if (!uploadedFile) {
        toast.error("Please upload a bank statement or confirmation letter")
        return
    }
    
    // Simulate save
    setCurrentDetails(formData)
    setIsEditing(false)
    setUploadedFile(null)
    toast.success("Bank details updated successfully", {
        description: "Your bank details have been submitted for verification."
    })
  }
  
  const handleCancel = () => {
    setFormData(currentDetails)
    setUploadedFile(null)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Bank Details</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your payout bank account</p>
            </div>
        </div>

        {!isEditing ? (
            <Card className="bg-card dark:bg-[#1d232a] border dark:border-white/20">
                <div className="flex items-center gap-2.5 px-6 py-3 bg-muted/40 border-b dark:border-white/10 rounded-t-xl">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">Your payout will be processed to this account</p>
                </div>
                <CardContent className="pt-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Account Holder Name</Label>
                            <p className="font-medium text-base">{currentDetails.accountName}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Account Number</Label>
                            <p className="font-medium text-base">{currentDetails.accountNumber}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Bank Name</Label>
                            <p className="font-medium text-base">{currentDetails.bankName}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">Branch</Label>
                            <p className="font-medium text-base">{currentDetails.branchName}</p>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 pt-5 border-t dark:border-white/10">
                        <Button variant="outline" onClick={() => setIsEditing(true)}>Change Details</Button>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <div className="space-y-6">
                <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertTitle className="text-blue-800 dark:text-blue-300">Compliance Requirements</AlertTitle>
                    <AlertDescription className="text-blue-700 dark:text-blue-400 mt-2">
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>NIC Merchants:</strong> Bank account name must match your NIC.</li>
                            <li><strong>Business Registration Merchants:</strong> Bank account name must match your Business Registration.</li>
                            <li>Document must be issued within the last 3 months.</li>
                        </ul>
                    </AlertDescription>
                </Alert>

                <Card className="bg-card dark:bg-[#1d232a] border dark:border-white/20">
                    <CardHeader>
                        <CardTitle>Update Bank Information</CardTitle>
                        <CardDescription>Enter your new bank account details below</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="bankName">Bank Name</Label>
                                <Input 
                                    id="bankName" 
                                    name="bankName"
                                    placeholder="e.g. Commercial Bank" 
                                    value={formData.bankName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="branchName">Branch Name</Label>
                                <Input 
                                    id="branchName" 
                                    name="branchName"
                                    placeholder="e.g. Colombo 03" 
                                    value={formData.branchName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input 
                                    id="accountNumber" 
                                    name="accountNumber"
                                    placeholder="Enter account number" 
                                    value={formData.accountNumber}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="accountName">Account Holder Name</Label>
                                <Input 
                                    id="accountName" 
                                    name="accountName"
                                    placeholder="Enter account holder name" 
                                    value={formData.accountName}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <Separator className="bg-border/50" />

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold">Verification Document</h3>
                                <p className="text-sm text-muted-foreground">
                                    Please upload a bank statement or bank confirmation letter issued within the last 3 months.
                                    The document must clearly show the account holder name, account number, bank, and branch.
                                </p>
                            </div>
                            
                            <div className="border-2 border-dashed border-border rounded-lg p-6 hover:bg-muted/30 transition-colors text-center cursor-pointer relative group">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center justify-center gap-3">
                                    {uploadedFile ? (
                                        <>
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{uploadedFile.name}</div>
                                                <div className="text-xs text-muted-foreground">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="mt-1 text-destructive hover:text-destructive hover:bg-destructive/10 z-20" onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation(); // Stop propagation to file input
                                                setUploadedFile(null);
                                                // Reset file input value
                                                const fileInput = e.currentTarget.closest('.relative')?.querySelector('input[type="file"]') as HTMLInputElement;
                                                if (fileInput) fileInput.value = '';
                                            }}>Remove</Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <UploadCloud className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">Click to upload or drag and drop</div>
                                                <div className="text-xs text-muted-foreground">PDF, JPG or PNG (Max 5MB)</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave}>Submit for Review</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )}
    </div>
  )
}