export function filterData<T>(data: T[], searchTerm: string): T[] {
    if (!searchTerm.trim()) return data;
    const lowerTerm = searchTerm.toLocaleLowerCase();

    return data.filter((item) =>
        Object.values(item as string).some((value) =>
            String(value).toLocaleLowerCase().includes(lowerTerm)
        )
    );
}
