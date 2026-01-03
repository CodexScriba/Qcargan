/**
 * Design Showcase Page
 * This page demonstrates the full visual hierarchy of the design system.
 * Once finalized, this serves as the reference for all future UI work.
 */

import { ThemeSwitcher } from "@/components/layout/theme-switcher"

export default function DesignShowcasePage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <header className="border-b border-border/40 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Container with Cards */}
        <div className="card-container rounded-3xl space-y-6">
          {/* Section Header with Accent Bar */}
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 gradient-primary-brand-vertical rounded-full" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Charging Stations</h2>
              <p className="text-sm text-muted-foreground">Your network at a glance</p>
            </div>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="card rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">Station Alpha</h4>
                <p className="text-sm text-muted-foreground mt-1">Downtown Plaza, Unit 12</p>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today&apos;s sessions</span>
                  <span className="font-medium text-foreground">24</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="card rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Active</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">Station Beta</h4>
                <p className="text-sm text-muted-foreground mt-1">Tech Park, Building C</p>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today&apos;s sessions</span>
                  <span className="font-medium text-foreground">18</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="card rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Maintenance</span>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-foreground">Station Gamma</h4>
                <p className="text-sm text-muted-foreground mt-1">Harbor View, Lot 5</p>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Today&apos;s sessions</span>
                  <span className="font-medium text-foreground">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Container with Table */}
        <div className="card-container rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 gradient-primary-brand-vertical rounded-full" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recent Sessions</h2>
              <p className="text-sm text-muted-foreground">Last 24 hours of charging activity</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-border/30">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Station</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">User</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Duration</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Energy</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wide px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                <tr className="bg-card/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">Station Alpha</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">user@email.com</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">1h 24m</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">32.5 kWh</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground text-right">$12.50</td>
                </tr>
                <tr className="bg-card/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">Station Beta</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">driver@test.com</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">45m</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">18.2 kWh</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground text-right">$7.28</td>
                </tr>
                <tr className="bg-card/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">Station Alpha</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">ev.owner@mail.com</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">2h 10m</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">55.0 kWh</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground text-right">$22.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Row - Cards directly on background */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-semibold text-foreground mt-1">$12,450</p>
            <p className="text-xs text-emerald-600 mt-2">+12% from last month</p>
          </div>
          <div className="card rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Active Sessions</p>
            <p className="text-2xl font-semibold text-foreground mt-1">8</p>
            <p className="text-xs text-muted-foreground mt-2">Across 3 stations</p>
          </div>
          <div className="card rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Energy Delivered</p>
            <p className="text-2xl font-semibold text-foreground mt-1">2.4 MWh</p>
            <p className="text-xs text-emerald-600 mt-2">+8% from last month</p>
          </div>
          <div className="card rounded-xl p-5">
            <p className="text-sm text-muted-foreground">Uptime</p>
            <p className="text-2xl font-semibold text-foreground mt-1">99.2%</p>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </div>
        </div>

        {/* Form Elements Section */}
        <div className="card-container rounded-3xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 gradient-primary-brand-vertical rounded-full" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Form Elements</h2>
              <p className="text-sm text-muted-foreground">Input styles and buttons</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Station Name</label>
                <input
                  type="text"
                  placeholder="Enter station name"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Buttons</label>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary px-4 py-2.5 text-sm font-medium rounded-lg">
                    Primary
                  </button>
                  <button className="btn-secondary px-4 py-2.5 text-sm font-medium rounded-lg">
                    Secondary
                  </button>
                  <button className="btn-ghost px-4 py-2.5 text-sm font-medium rounded-lg">
                    Ghost
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Destructive</label>
                <div className="flex flex-wrap gap-3">
                  <button className="btn-destructive px-4 py-2.5 text-sm font-medium rounded-lg">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
