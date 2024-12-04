'use client'

import React from 'react'
import { DashboardSidebar } from '@/components/ui/sidebar'

interface SidebarProps {
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ setActiveTab }: SidebarProps) {
  return <DashboardSidebar setActiveTab={setActiveTab} />
}

