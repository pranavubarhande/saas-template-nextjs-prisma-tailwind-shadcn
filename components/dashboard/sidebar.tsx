'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings as SettingsIcon,
} from 'lucide-react';
import { NavUser } from './nav-user';
import Image from 'next/image';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const mainItems = [
    {
      label: 'Dashboard',
      href: ROUTES.dashboard,
      icon: LayoutDashboard,
    },
    {
      label: 'Teams',
      href: ROUTES.teams,
      icon: Users,
    },
    {
      label: 'Billing',
      href: ROUTES.billing,
      icon: CreditCard,
    },
  ];

  const iconFor = (href: string) => {
    const item = mainItems.find((item) => item.href === href);
    return item ? <item.icon size={16} /> : <LayoutDashboard size={16} />;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        {/* App Logo and Name */}
        
        <div className="flex items-center gap-1 px-3 pt-4 group/header">
          <div className="flex items-center justify-center w-6 h-6 shrink-0">
            <Image
              src="/globe.svg"
              alt="App Logo"
              width={16}
              height={16}
              className="dark:invert"
              priority
            />
          </div>
          <span className="font-semibold text-sm whitespace-nowrap transition-all duration-300 opacity-100 group-data-[collapsible=icon]/sidebar:opacity-0 group-data-[collapsible=icon]/sidebar:invisible group-data-[collapsible=icon]/sidebar:w-0 group-data-[collapsible=icon]/sidebar:overflow-hidden">
            SaaA Template
          </span>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname?.startsWith(item.href + '/');
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={!!active}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2"
                      >
                        {iconFor(item.href)}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="absolute bottom-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === ROUTES.settings}>
              <Link href={ROUTES.settings} className="flex items-center gap-2">
                <SettingsIcon size={16} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
