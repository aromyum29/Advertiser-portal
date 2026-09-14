// @ts-nocheck
import { useState, useEffect } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CountdownSegment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[60px]">
      <div className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2.5 shadow-lg">
        <p className="text-2xl font-bold tabular-nums tracking-tight text-white text-center leading-none font-mono">
          {value.toString().padStart(2, '0')}
        </p>
      </div>
      <p className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
        {label}
      </p>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex items-center justify-center h-12 -mt-4">
      <span className="text-white/30 text-xl font-bold">:</span>
    </div>
  )
}

export function BlackFridayCountdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex items-center gap-1.5">
      <CountdownSegment value={timeLeft.days} label="Days" />
      <Separator />
      <CountdownSegment value={timeLeft.hours} label="Hours" />
      <Separator />
      <CountdownSegment value={timeLeft.minutes} label="Mins" />
      <Separator />
      <CountdownSegment value={timeLeft.seconds} label="Secs" />
    </div>
  )
}
