import * as React from "react";
import { LogIn, Plus } from "lucide-react";

import { NavMain } from "@/components/nav/nav-main";
import { NavAdminMenu } from "@/components/nav/nav-admin-menu";
import { NavUser } from "@/components/nav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { navData, team } from "@/config/site-config";
import { NavBrand } from "./nav-brand";
import { useAuthStore } from "@/states/auth-state";
import { buildImageUrl } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userDetails } = useAuthStore();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavBrand team={team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        {userDetails && (
          <div>
            <NavAdminMenu projects={navData.navAdmin} />
            {userDetails?.blogId && (
              <div className="flex flex-col gap-2 p-2 py-0">
                <SidebarMenuButton
                  asChild
                  size="lg"
                  variant="outline"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <Link to="/create">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                      <Plus className="size-4" />
                    </div>
                    <span className="truncate font-semibold">
                      Новая публикация
                    </span>
                  </Link>
                </SidebarMenuButton>
              </div>
            )}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        {userDetails ? (
          <NavUser
            name={userDetails?.name || ""}
            email={userDetails?.email || ""}
            avatarUrl={buildImageUrl(userDetails.avatarFileId)}
          />
        ) : (
          <SidebarMenuButton
            asChild
            size="lg"
            variant="outline"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Link to="/login">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <LogIn className="size-4" />
              </div>
              <span className="truncate font-semibold">Вход в аккаунт</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
