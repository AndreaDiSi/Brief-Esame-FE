import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Link, Outlet } from "react-router"

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Toaster } from "sonner"


// Menu items.
const items = [
    {
        title: "Home",
        url: "/",
        
    },
    {
        title: "Accomodations",
        url: "/accomodations",
       
    },
    {
        title: "Hosts",
        url: "/hosts",
       
    },
    {
        title: "Tenants",
        url: "/tenants",
        
    },
    {
        title: "Reservations",
        url: "/reservations",
        
    },
    {
        title: "Feedbacks",
        url: "/feedbacks",
        
    },
]

function Layout() {
    return (
        <SidebarProvider>
            <Toaster />
            <Sidebar className="min-h-full">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton render={<Link to={item.url} />}  className="flex gap-4">
                                            
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main>
                <SidebarTrigger />

            </main>
            <div className="p-1">
                <Outlet />
            </div>


        </SidebarProvider>
    )
}
export default Layout