// import React from 'react'


// const HeroSection = () => {
//     return (
//         <div className='relative h-[200vh]'
//             style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%);" }}>

//             <div className='fixed top-0 left-0 w-full h-screen bg-center bg-cover bg-fixed'
//                 style={{ backgroundImage: 'url(/images/barber-artist.jpg)' }} >
//                 test
//             </div>

//         </div>
//     )
// }

// export default HeroSection
'use client';

import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay"


const images = [
    '/images/barber-artist.jpg',
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/barber-artist.jpg'
];
const HeroSection = () => {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    return (
        <div className="relative w-full h-screen overflow-hidden bg-transparent">
            <Carousel
                opts={{ loop: true }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                className="w-full h-full fixed top-0 left-0 bg-cover bg-center bg-fixed">
                <CarouselContent className="w-full h-full">
                    {images.map((src, index) => (
                        <CarouselItem key={index} className="w-full h-full flex-shrink-0">
                            <Card className="w-full h-full">
                                <CardContent className="relative w-screen h-screen p-0">
                                    <Image
                                        src={src}
                                        alt={`carousel-${index}`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black text-white p-4 rounded-full" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black text-white p-4 rounded-full" />
            </Carousel>
        </div>
    );
};

export default HeroSection;
