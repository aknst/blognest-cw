import { AppSidebar } from "@/components/nav/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { ModeToggle } from "../common/ModeToggle";
import { navTemp } from "@/config/site-config";

function findActivePage(currentPath: any) {
  for (const [groupName, items] of Object.entries(navTemp)) {
    for (const item of items) {
      const match = matchPath(item.url, currentPath);
      if (match) {
        return { ...item, groupName, params: match.params };
      }
    }
  }
  return null;
}

export default function SidebarLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  const activePageInfo = findActivePage(currentPath);
  console.log(activePageInfo, currentPath);
  const groupTitle =
    activePageInfo?.groupName === "navMain"
      ? "Основные страницы"
      : activePageInfo?.groupName === "navAdmin"
      ? "Управление личным блогом"
      : activePageInfo?.groupName === "navBlogs"
      ? "Блоги"
      : "";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {activePageInfo ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink>{groupTitle}</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activePageInfo.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                ) : (
                  <BreadcrumbItem>
                    <BreadcrumbPage>Неизвестная страница</BreadcrumbPage>
                  </BreadcrumbItem>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex p-4">
            <ModeToggle />
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
