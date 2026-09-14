// @ts-nocheck
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { CalendarIcon, TagIcon, CurrencyDollarIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline"
import { FormData } from './types'
import { formatDateForDisplay } from './helpers/dateHelpers'

interface JoinCampaignConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  formData: FormData
  campaignName: string
  campaignImage: string
}

export function JoinCampaignConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  formData,
  campaignName,
  campaignImage
}: JoinCampaignConfirmationModalProps) {
  const formatPlatforms = () => {
    const platforms = []
    if (formData.platforms.inStore) platforms.push("In-Store")
    if (formData.platforms.website) platforms.push("Website")
    if (formData.platforms.socialMedia) platforms.push("Social Media")
    return platforms.length > 0 ? platforms.join(", ") : "None selected"
  }

  const getDiscountText = () => {
    if (formData.discountType === 'flat') {
      return `${formData.flatPercentage}% off all items`
    } else if (formData.discountType === 'selected-products') {
      return `${formData.selectedProductsPercentage}% off selected products (up to Rs. ${formData.selectedProductsUpTo})`
    } else {
      return "Not configured"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        aria-describedby="confirmation-modal-description"
      >
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl text-center">Confirm Campaign Details</DialogTitle>
          <DialogDescription id="confirmation-modal-description" className="text-center">
            <span className="text-muted-foreground">
              Please review your campaign settings before joining
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Campaign Info */}
          <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
            <img 
              src={campaignImage} 
              alt={campaignName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{campaignName}</h3>
              <Badge variant="secondary" className="mt-1">Campaign</Badge>
            </div>
          </div>

          {/* Campaign Duration */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-semibold">Campaign Duration</h4>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">From:</span> {formatDateForDisplay(formData.startDate)}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">To:</span> {formatDateForDisplay(formData.endDate)}
              </p>
            </div>
          </div>

          {/* Discount Application */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TagIcon className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-semibold">Discount Details</h4>
            </div>
            <div className="pl-7 space-y-2">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Discount:</span> {getDiscountText()}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Application:</span> {formData.applyDiscountThrough === 'koko' ? 'Through Koko' : 'Through Merchant'}
              </p>
            </div>
          </div>

          {/* Campaign Limits */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-semibold">Campaign Limits</h4>
            </div>
            <div className="pl-7 space-y-2">
              {formData.maxDiscountEnabled && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Maximum Discount:</span> Rs. {formData.maxDiscountAmount}
                </p>
              )}
              {formData.minPurchaseEnabled && (
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Minimum Purchase:</span> Rs. {formData.minPurchaseValue}
                </p>
              )}
              {!formData.maxDiscountEnabled && !formData.minPurchaseEnabled && (
                <p className="text-muted-foreground">No limits set</p>
              )}
            </div>
          </div>

          {/* Campaign Channels */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <DevicePhoneMobileIcon className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-semibold">Sales Channels</h4>
            </div>
            <div className="pl-7">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Platforms:</span> {formatPlatforms()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Back to Edit
          </Button>
          <Button 
            onClick={onConfirm}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Join Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}