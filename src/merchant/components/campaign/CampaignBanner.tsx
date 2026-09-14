// @ts-nocheck
import { TagIcon, ClockIcon } from "@heroicons/react/24/outline"
import { CAMPAIGN_BENEFITS } from './constants'
import astronautBg from 'figma:asset/a349729d02e5cf57b6a622320f58be0535982d3a.png'

interface CampaignBannerProps {
  campaignName: string
  campaignStartDate: string
  campaignEndDate: string
}

export function CampaignBanner({ campaignName, campaignStartDate, campaignEndDate }: CampaignBannerProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background Image - fills entire container */}
      <img 
        src={astronautBg} 
        alt="Campaign banner" 
        className="absolute inset-0 h-full w-full object-cover" 
      />
      
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Sticky Glassmorphic Header Panel */}
      <div className="sticky top-0 p-4 sm:p-6 lg:p-8">
        <div className="h-full backdrop-blur-md bg-white/15 dark:bg-black/25 border border-white/25 dark:border-white/20 rounded-xl shadow-lg p-5 lg:p-6">
          <div className="space-y-4 lg:space-y-6 text-white">
            {/* Campaign Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
              <TagIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-medium text-sm lg:text-base">Campaign</span>
            </div>
            
            {/* Campaign Name */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              {campaignName}
            </h2>
            
            {/* Campaign Period */}
            <div className="flex items-center gap-3 lg:gap-4 text-white/90">
              <ClockIcon className="h-5 w-5 lg:h-6 lg:w-6 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm lg:text-base">Campaign Period</p>
                <p className="text-lg lg:text-xl">{campaignStartDate} - {campaignEndDate}</p>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="space-y-4 lg:space-y-5 pt-4 lg:pt-6 border-t border-white/20">
              <h3 className="text-xl lg:text-2xl font-semibold">Why Join This Campaign?</h3>
              <ul className="space-y-3 lg:space-y-4 text-white/90">
                {CAMPAIGN_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                    <span className="text-base lg:text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}