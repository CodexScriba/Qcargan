'use client'

import React from 'react'

export function CarActionButtons() {
  return (
    <div className="flex gap-2">
      <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
        Contact Seller
      </button>
      <button className="px-4 py-2 border rounded-lg">
        Share
      </button>
    </div>
  )
}
