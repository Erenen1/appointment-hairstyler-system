'use client';
import React, { useState, useEffect } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { SSSProps } from '@/features/faq/types/SSSTypes';

const SSS = () => {
    const [questions, setQuestions] = useState<SSSProps[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('json/sss.json');
                const data = await res.json();
                setQuestions(data);
                console.log('SSS Getirildi', data)
                return data;
            } catch (error) {
                console.error('SSS getirilemedi', error)
                throw error;
            }
        }
        fetchData();
    }, [])


    return (
        <div className='px-6 md:px-16 lg:px-32'>
            <div className='flex flex-col mt-20'>
                <div className='max-w-7xl w-full mx-auto flex flex-col'>
                    <h1 className='font-bold text-4xl text-indigo-500 text-center'>Sıkça Sorulan Sorular</h1>
                    {questions.map((sss) => (
                        <Accordion type="single"
                            collapsible
                            key={sss.id}>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>{sss.question}</AccordionTrigger>
                                <AccordionContent>
                                    {sss.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SSS