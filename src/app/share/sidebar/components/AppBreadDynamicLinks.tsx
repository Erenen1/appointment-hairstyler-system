'use client';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation';
import React from 'react'

const formatSegment = (segment: string) => {
    return segment
        .replace(/-/g, ' ') //tireleri boşluğpa çevir
        .replace(/\b\w/g, (char) => char.toUpperCase());//her kelimenin ilk harfini büyük yap
}

const AppBreadDynamicLinks = () => {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean)// boş  strinleri filtrele


    return (

        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const isLast = index === segments.length - 1;
                    const formatted = formatSegment(segment);
                    return (
                        <React.Fragment key={segment}>
                            {index !== 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem className="hidden md:block">
                                {isLast ? (

                                    <BreadcrumbPage>{formatted}</BreadcrumbPage>
                                ) : (
                                    <span className='text-muted-foreground hidden md:inline'>{formatted}</span>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
                <BreadcrumbItem>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

    )
}

export default AppBreadDynamicLinks


