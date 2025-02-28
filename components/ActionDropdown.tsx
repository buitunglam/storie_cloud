"use client";

import { Models } from "node-appwrite";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { actionsDropdownItems } from "@/app/constants";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
    deleteFile,
    renameFile,
    updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "./ActionsModalContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
    const [action, setAction] = React.useState<ActionType | null>(null);
    const [name, setName] = React.useState(file.name);
    const [isLoading, setIsLoading] = React.useState(false);
    const [emails, setEmails] = useState<string[]>([]);
    const path = usePathname();
    // function
    const closeActionModals = () => {
        setIsModalOpen(false);
        setIsDropDownOpen(false);
        setAction(null);
        setName(file.name);
        // setEmail([]);
    };

    const handleAction = async () => {
        if (!action) return;
        setIsLoading(true);
        let success = false;
        const actions = {
            rename: async () =>
                renameFile({
                    fileId: file.$id,
                    name,
                    extension: file.extension,
                    path,
                }),
            share: () => updateFileUsers({ fileId: file.$id, emails, path }),
            delete: () =>
                deleteFile({
                    fileId: file.$id,
                    bucketFileId: file.bucketFileId,
                    path,
                }),
        };
        success = await actions[action.value as keyof typeof actions]();
        console.log("success ---", success);
        if (success) closeActionModals();
        setIsLoading(false);
    };

    const handleRemoveUser = async (email: string) => {
        const updateEmails = emails.filter((e) => e !== email);
        const success = await updateFileUsers({
            fileId: file.$id,
            emails: updateEmails,
            path,
        });

        if (success) setEmails(updateEmails);
        closeActionModals();
    };

    const renderDialogContent = () => {
        if (!action) return null;
        const { value, label } = action;

        return (
            <DialogContent className="shad-dialog button">
                <DialogHeader className="flex flex-col gap-3">
                    <DialogTitle className="text-center text-light-100">
                        {label}
                    </DialogTitle>
                    {value === "rename" && (
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    {value === "details" && <FileDetails file={file} />}
                    {value === "share" && (
                        <ShareInput
                            file={file}
                            onInputChange={setEmails}
                            onRemove={handleRemoveUser}
                        />
                    )}
                    {value === "delete" && (
                        <p className="delete-confirmation">
                            Are you sure you want to delete {` `}
                            <span className="delete-file-name">
                                {file.name}
                            </span>
                        </p>
                    )}
                </DialogHeader>
                {["rename", "delete", "share"].includes(value) && (
                    <DialogFooter className="flex flex-col gap-3 md:flex-row">
                        <Button
                            className="modal-cancel-button"
                            onClick={closeActionModals}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="modal-submit-button"
                            onClick={handleAction}
                        >
                            <p className="capitalize">{value}</p>
                            {isLoading && (
                                <Image
                                    src="/assets/icons/loader.svg"
                                    alt="loader"
                                    width={20}
                                    height={20}
                                    className="animate-spin"
                                />
                            )}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        );
    };

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DropdownMenu
                    open={isDropDownOpen}
                    onOpenChange={setIsDropDownOpen}
                >
                    <DropdownMenuTrigger className="shad-no-focus">
                        <Image
                            src="/assets/icons/dots.svg"
                            alt="dots"
                            width={34}
                            height={34}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className=" max-w-[200px] truncate">
                            {file.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {actionsDropdownItems.map((actionItem) => (
                            <DropdownMenuItem
                                key={actionItem.value}
                                className="shad-dropdown-item"
                                onClick={() => {
                                    setAction(actionItem);
                                    if (
                                        [
                                            "rename",
                                            "share",
                                            "delete",
                                            "details",
                                        ].includes(actionItem.value)
                                    ) {
                                        setIsModalOpen(true);
                                    }
                                }}
                            >
                                {actionItem.value === "download" ? (
                                    <Link
                                        href={constructDownloadUrl(
                                            file.bucketFileId
                                        )}
                                        download={file.name}
                                        className="flex items-center gap-2"
                                    >
                                        <Image
                                            src={actionItem.icon}
                                            alt={actionItem.label}
                                            width={30}
                                            height={30}
                                        />

                                        {actionItem.label}
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src={actionItem.icon}
                                            alt={actionItem.label}
                                            width={30}
                                            height={30}
                                        />

                                        {actionItem.label}
                                    </div>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                {renderDialogContent()}
            </Dialog>
        </>
    );
};

export default ActionDropdown;
