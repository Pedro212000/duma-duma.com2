// AppLayout.tsx
import { ReactNode } from "react";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface AppLayoutProps {
    breadcrumbs: BreadcrumbItem[];
    children: ReactNode; // 👈 This means "children" must be passed
}

export default function AppLayout({ breadcrumbs = [], children }: AppLayoutProps) {
    return (
        <div>
            {/* Breadcrumbs */}
            <nav>
                {breadcrumbs.map((b, i) => (
                    <a key={i} href={b.href}>
                        {b.label}
                    </a>
                ))}
            </nav>

            {/* Page content */}
            <main>{children}</main>
            sdfsdf
        </div>
    );
}

