import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Link, Outlet } from "react-router"
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
import { Banknote, BookCheck, HatGlasses, Home, HouseHeart, LucideHome, MessageSquareDot } from "lucide-react"



const items = [
    {
        title: "Home",
        url: "/",
        icon: Home

    },
    {
        title: "Accomodations",
        url: "/accomodations",
        icon: HouseHeart
    },
    {
        title: "Hosts",
        url: "/hosts",
        icon: HatGlasses
    },
    {
        title: "Tenants",
        url: "/tenants",
        icon: Banknote
    },
    {
        title: "Reservations",
        url: "/reservations",
        icon: BookCheck
    },
    {
        title: "Feedbacks",
        url: "/feedbacks",
        icon: MessageSquareDot
    },
]

function Layout() {
    return (
        <SidebarProvider>
            <Toaster />
            <Sidebar className="min-h-full">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-black font-bold">Professional Dashboard</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton render={<Link to={item.url} />} className="flex gap-4">
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
            <main className="flex flex-1 w-full">
                <SidebarTrigger />
                <div className="flex flex-1 w-full">
                    <Outlet />
                </div>
            </main>



        </SidebarProvider>
    )
}
export default Layout