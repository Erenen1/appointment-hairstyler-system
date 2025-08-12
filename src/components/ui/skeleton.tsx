"use client";

import { cn } from "@/lib/utils";

// Base Skeleton Component
interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className, children }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
}

// ========================================
// 📊 DASHBOARD SKELETONS
// ========================================

// Admin Dashboard Skeleton
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="border-0 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <Skeleton className="h-12 w-16 mx-auto mb-2" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
        <div className="border-0 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <Skeleton className="h-12 w-16 mx-auto mb-2" />
            <Skeleton className="h-6 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>
        <div className="border-0 shadow-lg rounded-lg p-6">
          <div className="text-center">
            <Skeleton className="h-6 w-32 mx-auto mb-3" />
            <Skeleton className="h-48 w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Navigation Cards Skeleton */}
      <div className="grid md:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-0 shadow-md rounded-lg p-4">
            <div className="text-center">
              <Skeleton className="h-16 w-16 mx-auto mb-3 rounded-full" />
              <Skeleton className="h-6 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========================================
// 📅 APPOINTMENTS SKELETONS
// ========================================

// Appointments Page Skeleton
export function AppointmentsPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Charts Grid Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="rounded-lg border p-6">
          <Skeleton className="h-6 w-32 mb-3" />
          <Skeleton className="h-80 w-full rounded-full" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-lg border p-6">
        <div className="flex justify-end pb-3">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================
// 👥 CUSTOMERS SKELETONS
// ========================================

// Customers Page Skeleton
export function CustomersPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3 items-center">
              <Skeleton className="h-10 w-80" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-8 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 💰 FINANCIAL SKELETONS
// ========================================

// Income/Expense Page Skeleton
export function FinancialPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 border border-green-200">
        <div className="text-center mb-8">
          <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Form and Table Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-32 mt-6" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 📱 WHATSAPP BOT SKELETONS
// ========================================

// WhatsApp Bot Page Skeleton
export function WhatsAppBotSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 border border-green-200">
        <div className="text-center mb-8">
          <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Contacts Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-24 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 py-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-24 mb-6" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="py-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ========================================
// 🏢 PROPERTY ANALYTICS SKELETONS
// ========================================

// Property Analytics Page Skeleton
export function PropertyAnalyticsSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-xl p-8 border border-purple-200">
        <div className="text-center mb-8">
          <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-80 w-full rounded-full" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========================================
// ⚙️ SETTINGS SKELETONS
// ========================================

// Settings Page Skeleton
export function SettingsPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex space-x-8 px-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="py-4">
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ========================================
// 📊 STATISTICS SKELETONS
// ========================================

// Statistics Page Skeleton
export function StatisticsPageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-8 border border-orange-200">
        <div className="text-center mb-8">
          <Skeleton className="h-20 w-20 mx-auto mb-6 rounded-full" />
          <Skeleton className="h-10 w-64 mx-auto mb-3" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-14 w-14 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <Skeleton className="h-6 w-32 mb-6" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}

// ========================================
// 🎯 UNIVERSAL SKELETONS
// ========================================

// Generic Page Skeleton
export function PageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-20" />
      ))}
    </div>
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <Skeleton className="h-6 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// Form Field Skeleton
export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Button Skeleton
export function ButtonSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-20",
    default: "h-10 w-24",
    lg: "h-12 w-32"
  };

  return <Skeleton className={sizeClasses[size]} />;
}

// Avatar Skeleton
export function AvatarSkeleton({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-10 w-10",
    lg: "h-16 w-16"
  };

  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />;
}

// Chart Skeleton
export function ChartSkeleton({ height = "h-80" }: { height?: string }) {
  return <Skeleton className={`${height} w-full rounded-lg`} />;
}

// List Item Skeleton
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 py-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

// Search Bar Skeleton
export function SearchBarSkeleton() {
  return (
    <div className="flex items-center space-x-3">
      <Skeleton className="h-10 w-80" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
}

// Pagination Skeleton
export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <div className="flex space-x-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded" />
        ))}
      </div>
    </div>
  );
}

// Modal Skeleton
export function ModalSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <FormFieldSkeleton key={i} />
        ))}
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Sidebar Skeleton
export function SidebarSkeleton() {
  return (
    <div className="bg-white border-r border-gray-200 p-4 space-y-4">
      <Skeleton className="h-8 w-32 mb-6" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 py-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

// Header Skeleton
export function HeaderSkeleton() {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}

// Footer Skeleton
export function FooterSkeleton() {
  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-24" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-32" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading State Skeleton
export function LoadingStateSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-6 w-32 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}

// Error State Skeleton
export function ErrorStateSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Skeleton className="h-20 w-20 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-6 w-40 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-4" />
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    </div>
  );
}

// Empty State Skeleton
export function EmptyStateSkeleton() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Skeleton className="h-24 w-24 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-6 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto mb-4" />
        <Skeleton className="h-10 w-36 mx-auto" />
      </div>
    </div>
  );
}

// ========================================
// 🎨 EXPORT ALL SKELETONS
// ========================================

export {
  // Base
  Skeleton,

  // Page-specific
  AdminDashboardSkeleton,
  AppointmentsPageSkeleton,
  CustomersPageSkeleton,
  FinancialPageSkeleton,
  WhatsAppBotSkeleton,
  PropertyAnalyticsSkeleton,
  SettingsPageSkeleton,
  StatisticsPageSkeleton,

  // Universal
  PageSkeleton,
  TableRowSkeleton,
  CardSkeleton,
  FormFieldSkeleton,
  ButtonSkeleton,
  AvatarSkeleton,
  ChartSkeleton,
  ListItemSkeleton,
  SearchBarSkeleton,
  PaginationSkeleton,
  ModalSkeleton,
  SidebarSkeleton,
  HeaderSkeleton,
  FooterSkeleton,

  // States
  LoadingStateSkeleton,
  ErrorStateSkeleton,
  EmptyStateSkeleton
};
