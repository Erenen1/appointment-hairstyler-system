// /app/calendar/hooks/useCalendarData.ts
'use client';
import { useEffect, useState } from "react";

export const useCalendarData = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetch("/json/calendar.json")
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                console.log("Calendar Data:", json);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsError(true);
                console.error("Error fetching calendar data", error);

                setIsLoading(false);
            });
    }, []);

    return { data, isLoading, isError };
};