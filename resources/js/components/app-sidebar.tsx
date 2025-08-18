import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Users,
    Settings,
    FileText,
    Briefcase,
} from 'lucide-react';
import AppLogo from './app-logo';

// ✅ Role-based sidebar config
const sidebarConfig: Record<string, NavItem[]> = {
    admin: [
        { title: 'admisdfsf', href: '/dashboard', icon: LayoutGrid },
        { title: 'Users', href: '/users', icon: Users },
        { title: 'Settings', href: '/settings', icon: Settings },
    ],
    publisher: [
        { title: 'Dashboasdfrd', href: '/dashboard', icon: LayoutGrid },
        { title: 'Posts', href: '/posts', icon: FileText },
    ],

};

// ✅ Footer nav (common for all roles, but can also be role-specific)
const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const role = (props as any).auth.user.role;

    // Pick role-based links, fallback to "user" if role not found
    const mainNavItems: NavItem[] = sidebarConfig[role] || sidebarConfig['user'];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
