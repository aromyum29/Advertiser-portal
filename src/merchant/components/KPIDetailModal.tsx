// @ts-nocheck
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { DollarSign, ShoppingCart, XCircle, Clock, TrendingUp, TrendingDown, Users, Package } from "lucide-react"

interface KPIDetailModalProps {
  isOpen: boolean
  onClose: () => void
  kpiType: 'payment' | 'orders' | 'cancelled' | 'pending'
  value: string
  title: string
  trend: 'up' | 'down' | 'neutral'
  change: number
}

export function KPIDetailModal({ isOpen, onClose, kpiType, value, title, trend, change }: KPIDetailModalProps) {
  
  // Generate mock data based on KPI type
  const generateKPIData = (type: string) => {
    switch(type) {
      case 'payment':
        return {
          pieData: [
            { name: 'Online Payments', value: 45, color: '#10B981' },
            { name: 'Card Payments', value: 30, color: '#3B82F6' },
            { name: 'Cash Payments', value: 15, color: '#F59E0B' },
            { name: 'Bank Transfers', value: 10, color: '#8B5CF6' }
          ],
          barData: [
            { month: 'Jan', amount: 2.1 },
            { month: 'Feb', amount: 2.4 },
            { month: 'Mar', amount: 2.8 },
            { month: 'Apr', amount: 3.2 },
            { month: 'May', amount: 2.9 },
            { month: 'Jun', amount: 3.5 }
          ],
          insights: [
            { label: 'Average Transaction', value: 'Rs. 2,450' },
            { label: 'Peak Hour', value: '2:00 PM - 4:00 PM' },
            { label: 'Top Payment Method', value: 'Online Payments' },
            { label: 'Growth Rate', value: '+12.5%' }
          ]
        }
      
      case 'orders':
        return {
          pieData: [
            { name: 'Completed', value: 75, color: '#10B981' },
            { name: 'Processing', value: 15, color: '#F59E0B' },
            { name: 'Cancelled', value: 7, color: '#EF4444' },
            { name: 'Returned', value: 3, color: '#6B7280' }
          ],
          barData: [
            { month: 'Jan', orders: 1250 },
            { month: 'Feb', orders: 1380 },
            { month: 'Mar', orders: 1520 },
            { month: 'Apr', orders: 1680 },
            { month: 'May', orders: 1590 },
            { month: 'Jun', orders: 1720 }
          ],
          insights: [
            { label: 'Daily Average', value: '57 orders' },
            { label: 'Peak Day', value: 'Saturday' },
            { label: 'Completion Rate', value: '75%' },
            { label: 'Avg Processing Time', value: '2.3 hours' }
          ]
        }
      
      case 'cancelled':
        return {
          pieData: [
            { name: 'Customer Request', value: 40, color: '#EF4444' },
            { name: 'Payment Failed', value: 25, color: '#F97316' },
            { name: 'Out of Stock', value: 20, color: '#F59E0B' },
            { name: 'System Error', value: 15, color: '#6B7280' }
          ],
          barData: [
            { month: 'Jan', cancelled: 85 },
            { month: 'Feb', cancelled: 92 },
            { month: 'Mar', cancelled: 78 },
            { month: 'Apr', cancelled: 65 },
            { month: 'May', cancelled: 70 },
            { month: 'Jun', cancelled: 58 }
          ],
          insights: [
            { label: 'Cancellation Rate', value: '7%' },
            { label: 'Main Reason', value: 'Customer Request' },
            { label: 'Peak Time', value: '11:00 AM - 1:00 PM' },
            { label: 'Trend', value: 'Decreasing (-12%)' }
          ]
        }
      
      case 'pending':
        return {
          pieData: [
            { name: 'Payment Verification', value: 45, color: '#F59E0B' },
            { name: 'Inventory Check', value: 25, color: '#8B5CF6' },
            { name: 'Manual Review', value: 20, color: '#3B82F6' },
            { name: 'System Queue', value: 10, color: '#6B7280' }
          ],
          barData: [
            { month: 'Jan', pending: 180 },
            { month: 'Feb', pending: 165 },
            { month: 'Mar', pending: 190 },
            { month: 'Apr', pending: 210 },
            { month: 'May', pending: 195 },
            { month: 'Jun', pending: 220 }
          ],
          insights: [
            { label: 'Avg Wait Time', value: '2.3 hours' },
            { label: 'Resolution Rate', value: '94%' },
            { label: 'Peak Queue', value: 'Monday Morning' },
            { label: 'Auto-Resolve', value: '68%' }
          ]
        }
      
      default:
        return { pieData: [], barData: [], insights: [] }
    }
  }

  const data = generateKPIData(kpiType)
  
  const getIcon = () => {
    switch(kpiType) {
      case 'payment': return <DollarSign className="h-6 w-6" />
      case 'orders': return <ShoppingCart className="h-6 w-6" />
      case 'cancelled': return <XCircle className="h-6 w-6" />
      case 'pending': return <Clock className="h-6 w-6" />
    }
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-500'
    if (trend === 'down') return 'text-red-500'
    return 'text-muted-foreground'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4" />
    return null
  }

  // Custom label component for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.08 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize="13"
        fontWeight="700"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-7xl max-h-[95vh] overflow-y-auto bg-white dark:bg-card border border-border/50 shadow-2xl p-0 gap-0 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
        aria-describedby="kpi-modal-description"
      >
        <DialogHeader className="px-6 lg:px-8 pt-6 lg:pt-8 pb-4">
          <DialogTitle className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-3 lg:gap-4">
            <div className="p-2 lg:p-3 rounded-xl bg-[#BDDDEE]/10 text-[#1D232A] dark:text-white">
              {getIcon()}
            </div>
            {title} Analysis
          </DialogTitle>
          <DialogDescription id="kpi-modal-description" className="text-muted-foreground mt-3 text-base lg:text-lg">
            Detailed breakdown and insights for {title.toLowerCase()} performance metrics, including distribution charts, trends, and actionable recommendations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 lg:px-8 pb-6 lg:pb-8 space-y-6 lg:space-y-8">
          {/* Header Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 lg:p-8 bg-gradient-to-r from-[#BDDDEE]/10 to-[#DCF3FF]/20 rounded-xl lg:rounded-2xl border border-[#BDDDEE]/20">
            <div className="space-y-2 lg:space-y-3">
              <h3 className="text-3xl lg:text-4xl font-bold text-foreground">{value}</h3>
              <p className="text-muted-foreground text-base lg:text-lg">Current Period Total</p>
            </div>
            <div className={`flex items-center gap-2 lg:gap-3 px-4 py-3 rounded-lg lg:rounded-xl bg-white/50 dark:bg-card/50 ${getTrendColor()} self-start sm:self-center`}>
              {getTrendIcon()}
              <span className="font-semibold text-base lg:text-lg">
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Pie Chart */}
            <div className="bg-white dark:bg-card/50 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Distribution Breakdown</h4>
              <div className="h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={120}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: 'var(--foreground)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '24px', fontSize: '14px' }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-card/50 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h4 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">6-Month Trend</h4>
              <div className="h-80 lg:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.3} />
                    <XAxis 
                      dataKey="month" 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="var(--muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'var(--background)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        color: 'var(--foreground)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey={kpiType === 'payment' ? 'amount' : kpiType === 'orders' ? 'orders' : kpiType === 'cancelled' ? 'cancelled' : 'pending'} 
                      fill="#BDDDEE" 
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div className="bg-white dark:bg-card/50 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
            <h4 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Key Insights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {data.insights.map((insight, index) => (
                <div key={index} className="p-4 lg:p-6 bg-gradient-to-br from-[#DCF3FF]/30 to-[#BDDDEE]/20 rounded-xl border border-[#BDDDEE]/20 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]">
                  <p className="text-sm lg:text-base text-muted-foreground font-medium mb-2">{insight.label}</p>
                  <p className="text-lg lg:text-xl font-bold text-foreground">{insight.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-gradient-to-r from-[#DCF3FF]/40 to-[#BDDDEE]/30 dark:from-[#1D232A]/80 dark:to-[#1D232A]/60 p-6 lg:p-8 rounded-xl lg:rounded-2xl border border-[#BDDDEE]/30 dark:border-border/30">
            <h4 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#BDDDEE]/20">
                <Users className="h-5 w-5 text-[#1D232A] dark:text-white" />
              </div>
              Recommended Actions
            </h4>
            <div className="space-y-3 lg:space-y-4">
              {kpiType === 'payment' && (
                <>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Promote online payment methods to increase digital adoption</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Optimize peak hour processing to handle 2-4 PM rush</p>
                  </div>
                </>
              )}
              {kpiType === 'orders' && (
                <>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Focus on Saturday promotions to capitalize on peak day</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Improve processing time to reduce average completion time</p>
                  </div>
                </>
              )}
              {kpiType === 'cancelled' && (
                <>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Implement better inventory tracking to reduce stock-related cancellations</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Add payment retry mechanisms to reduce payment failures</p>
                  </div>
                </>
              )}
              {kpiType === 'pending' && (
                <>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Automate payment verification process to reduce manual review</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 lg:p-4 bg-white/50 dark:bg-card/30 rounded-lg border border-[#BDDDEE]/20">
                    <div className="w-2 h-2 rounded-full bg-[#BDDDEE] mt-2 flex-shrink-0"></div>
                    <p className="text-sm lg:text-base text-muted-foreground">Optimize Monday morning workflows to handle peak queue</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}