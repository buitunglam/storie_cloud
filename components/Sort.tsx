"use client";

import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { sortTypes } from "@/app/constants";

const Sort = () => {
    const path = usePathname();
    const router = useRouter();
    const handleSort = (value: string) => {
        router.push(`${path}?sort=${value}`);
    };

    return (
        <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={sortTypes[0].value} />
            </SelectTrigger>
            <SelectContent>
                {sortTypes.map((sort) => (
                    <SelectItem key={sort.label} value={sort.value}>
                        {sort.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default Sort;
