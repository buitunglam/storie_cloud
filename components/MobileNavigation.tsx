"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { navItems } from "../app/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "./FileUploader";
import { signOutUser } from "@/lib/actions/user.actions";

interface Props {
  avatar: string;
  fullName: string;
  email: string;
  $id: string;
  accountId: string;
}

const MobileNavigation = ({
  $id: ownerId,
  accountId,
  avatar,
  fullName,
  email,
}: Props) => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await signOutUser();
  };

  return (
    <>
      <header className="mobile-header">
        <Image
          src={"assets/icons/logo-full-brand.svg"}
          alt="logo"
          width={120}
          height={52}
          className="h-auto"
        />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <Image
              src={"/assets/icons/menu.svg"}
              alt="Search"
              width={30}
              height={30}
            />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <div className="header-user">
                  <Image
                    src={avatar}
                    alt="avatar"
                    width={44}
                    height={44}
                    className="header-user-avatar"
                  />
                  <div className="sm:hidden lg:block">
                    <p className="subtitle-2 capitalize">{fullName}</p>
                    <p className="caption">{email}</p>
                  </div>
                </div>
                <Separator className="mb-4 bg-light-200/20" />
              </SheetTitle>

              <nav>
                {navItems.map(({ url, name, icon }) => {
                  const active = pathName === url;
                  return (
                    <Link href={url} key={name}>
                      <li
                        className={cn(
                          "mobile-nav-item",
                          active && "shad-active",
                          "mb-4"
                        )}
                      >
                        <Image
                          src={icon}
                          alt={name}
                          width={24}
                          height={24}
                          className={cn(
                            "nav-icon",
                            pathName === url && "nav-icon-active"
                          )}
                        />
                        <p>{name}</p>
                      </li>
                    </Link>
                  );
                })}
              </nav>
              <Separator className="my-5 bg-light-200/20" />
              <div className="flex flex-col justify-between gap-5 pb-5">
                <FileUploader ownerId={ownerId} accountId={accountId} />
                <Button
                  type="submit"
                  className="sign-out-button"
                  onClick={onSignOut}
                >
                  <>
                    {" "}
                    <Image
                      src="/assets/icons/logout.svg"
                      width={24}
                      height={24}
                      alt="logo"
                      className="w-6"
                    />
                    <p>Logout</p>
                  </>
                </Button>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
};

export default MobileNavigation;
