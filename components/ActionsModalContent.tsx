import { Models } from "node-appwrite";
import React from "react";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { on } from "events";
import { Button } from "./ui/button";
import Image from "next/image";

interface PropsShareInput {
    file: Models.Document;
    onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
    onRemove: (email: string) => void;
}

const ImageThumbnail = ({ file }: { file: Models.Document }) => {
    return (
        <div className="file-details-thumbnail">
            <Thumbnail
                type={file.type}
                extension={file.extension}
                url={file.url}
            />
            <div className="flex flex-col">
                <div className="subtitle-2 mb-1">{file.name}</div>
                <FormattedDateTime date={file.$createdAt} className="caption" />
            </div>
        </div>
    );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex">
        <p className="file-details-label text-left">{label}</p>
        <p className="file-details-value text-left">{value}</p>
    </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
    return (
        <>
            <ImageThumbnail file={file} />
            <div className="space-y-4 px-2 pt-2">
                <DetailRow label="Format" value={file.extension} />
                <DetailRow label="Size" value={file.size} />
                <DetailRow label="Owner" value={file.owner.fullName} />
                <DetailRow
                    label="Last edit:"
                    value={formatDateTime(file.$updatedAt)}
                />
            </div>
        </>
    );
};

export const ShareInput = ({
    file,
    onInputChange,
    onRemove,
}: PropsShareInput) => {
    console.log("ShareInput", file);
    return (
        <>
            <ImageThumbnail file={file} />
            <div className="share-wrapper">
                <p className="subtitle-2 pl-1 text-light-100">
                    Share file with other users
                </p>
                <Input
                    type="text"
                    placeholder="Enter email address"
                    className="share-input-field"
                    onChange={(e) =>
                        onInputChange(e.target.value.trim().split(","))
                    }
                />
                <div className="pt-4">
                    <div className="flex justify-between">
                        <p className="subtitle-2 text-light-100">Share with</p>
                        <p className="subtitle-2 text-light-200">
                            {file.users.length} users
                        </p>
                    </div>
                    <ul className="pat-2">
                        {file.users.map((email: string) => (
                            <li key={email} className="flex justify-between">
                                <p className="subtitle-2">{email}</p>
                                <Button
                                    className="share-remove-user"
                                    onClick={() => onRemove(email)}
                                >
                                    <Image
                                        src="/assets/icons/remove.svg"
                                        alt="Remove"
                                        width={24}
                                        height={24}
                                        className="remove-icon"
                                    />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
