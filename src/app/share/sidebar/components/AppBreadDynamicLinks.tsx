'use client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation';
import React from 'react'
import { data } from '../mock/navLinks';



const AppBreadDynamicLinks = () => {
    const pathname = usePathname();

    const getBreadcrumbItems = () => {
        const items: { title: string; url: string }[] = [];

        items.push({ title: 'Anasayfa', url: '/' });// Ana sayfa ekle

        data.navMain.forEach(mainItem => {
            if (mainItem.items) {
                mainItem.items.forEach(subItem => {
                    if (pathname == subItem.url) {
                        // Ana kategori ekle
                        items.push({ title: mainItem.title, url: mainItem.title })
                        // Alt sayfa ekle
                        items.push({ title: subItem.title, url: subItem.url })
                    }
                })
            }
        })
        return items;
    }

    const breadcrumbItems = getBreadcrumbItems();

    return (

        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbPage>
                                {item.title}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )

}

export default AppBreadDynamicLinks


