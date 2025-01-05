"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";
import { getFiles } from "@/lib/actions/file.actions";
import Thumbnail from "./Thumbnail";
import { Models } from "node-appwrite";
import FormattedDateTime from "./FormattedDateTime";

const Search = () => {
    const router = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("query");
    const [query, setQuery] = React.useState("");
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<Models.Document[]>([]);
    const [debonceQuery] = useDebounce(query, 300);
    useEffect(() => {
        const fetchFiles = async () => {
            if (debonceQuery.length === 0) {
                setResults([]);
                setOpen(false);
                return router.push(path);
            }

            const files = await getFiles({
                types: [],
                searchText: debonceQuery,
            });
            setResults(files.documents);
            setOpen(true);
        };
        fetchFiles();
    }, [debonceQuery]);

    useEffect(() => {
        if (!searchQuery) {
            setQuery("");
        }
    }, []);

    // function
    const handleClickItem = (file: Models.Document) => {
        setOpen(false);
        setResults([]);
        console.log("click ----");
        router.push(
            `/${
                file.type === "video" || file.type === "audio"
                    ? "media"
                    : file.type + "s"
            }?query=${query}`
        );
    };

    return (
        <div className="search">
            <div className="search-input-wrapper">
                <Image
                    src="/assets/icons/search.svg"
                    width={24}
                    height={24}
                    alt="search"
                />
                <Input
                    value={query}
                    placeholder="Search..."
                    className="search-input"
                    onChange={(e) => setQuery(e.target.value)}
                />

                {open && (
                    <ul className="search-result">
                        {results.length > 0 ? (
                            results.map((file) => (
                                <li
                                    className="flex items-center justify-between"
                                    key={file.$id}
                                    onClick={() => handleClickItem(file)}
                                >
                                    <div className="flex cursor-pointer items-center gap-4">
                                        <Thumbnail
                                            type={file.type}
                                            extension={file.extension}
                                            url={file.url}
                                            className="size-9 min-w-9"
                                        />
                                        <p className="subtitle-2 line-clamp-1 text-light-100">
                                            {file.name}
                                        </p>
                                    </div>

                                    <FormattedDateTime
                                        date={file.$createdAt}
                                        className="caption line-clamp-1 text-light-200"
                                    />
                                </li>
                            ))
                        ) : (
                            <p className="empty-result">No files found</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Search;
