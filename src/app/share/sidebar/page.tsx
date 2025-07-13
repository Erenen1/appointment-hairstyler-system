'use client';
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { VersionSwitcher } from "./components/VersionSwitcher"
import { SearchForm } from "./components/SearchForm"
import { NavUser } from "./components/nav-user"
import { usePathname, useRouter } from "next/navigation"
import { data } from './mock/navLinks';
import { useLoading } from "@/app/contexts/LoadingContext";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const { showLoading } = useLoading()
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent,
    url: string
  ) => {
    e.preventDefault();
    showLoading(2000);
    await new Promise(res => setTimeout(res, 300))
    router.push(url);
  }

  const isActiveItem = (itemUrl: string): boolean => {
    if (!pathname) return false;
    return pathname.startsWith(itemUrl);
  };

  if (isAdminPage) return null;
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items && item.items.map((item) => {
                  const isActive = isActiveItem(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={isActive ? "bg-primary/20 text-primary borer-r-2 border-primary font-medium" : ""}
                      >
                        <Link href={item.url}
                          onClick={(e) => handleClick(e, item.url)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-none transition-all duration-200 hover:bg-muted 
                        ${isActive ? 'bg-primary/20 text-primary shadow-sm border-l-4 border-primary'
                              : 'text-muted-foreground hover:text-foreground'}
                              `}>
                          {isActive && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          )}
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
