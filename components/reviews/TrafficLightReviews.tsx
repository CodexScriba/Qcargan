'use client'

import React from 'react'

export function TrafficLightReviews() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium">Positive</p>
          <p className="text-2xl font-bold">75%</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-medium">Neutral</p>
          <p className="text-2xl font-bold">20%</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-500 mx-auto mb-2" />
          <p className="text-sm font-medium">Negative</p>
          <p className="text-2xl font-bold">5%</p>
        </div>
      </div>
      {/* TODO: Implement full traffic light reviews UI */}
    </div>
  )
}
