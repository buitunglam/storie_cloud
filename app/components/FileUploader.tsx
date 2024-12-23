"use client";

import Thumbnail from "@/components/Thumbnail";
import { Button } from "@/components/ui/button";
import {
  cn,
  convertFileSize,
  convertFileToUrl,
  getFileType,
} from "@/lib/utils";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  ownerId: string;
  accountId: string;
  className: string;
}

const FileUploader = ({ ownerId, accountId, className }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    console.log("acceptedFiles--", acceptedFiles);
    setFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveFile = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const filteredFiles = files.filter((file) => file.name !== fileName);
    setFiles(filteredFiles);
  };

  return (
    <div {...getRootProps()} className="cursor-pointer">
      <input {...getInputProps()} />
      <Button type="button" className={cn("uploader-button", className)}>
        <Image
          src="/assets/icons/upload.svg"
          alt="upload"
          width={24}
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <>
          <ul className="uploader-preview-list">
            <h4 className="h4 text-light-100">Uploading</h4>
            {files.map((file, index) => {
              const { type, extension } = getFileType(file.name);
              return (
                <li
                  key={`${file.name}-${index}`}
                  className="uploader-preview-item"
                >
                  <div className="flex items-center gap-3">
                    <Thumbnail
                      type={type}
                      url={convertFileToUrl(file)}
                      extension={extension}
                    />
                    <div className="preview-item-name">
                      <span>{file.name}</span>
                      <Image
                        src="/assets/icons/file-loader.gif"
                        alt="loader"
                        width={80}
                        height={26}
                      />
                    </div>
                  </div>
                  <Image
                    src="/assets/icons/remove.svg"
                    width={24}
                    height={24}
                    alt="remove"
                    onClick={(e) => handleRemoveFile(e, file.name)}
                  />
                </li>
              );
            })}
          </ul>
        </>
      )}
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Select file upload</p>
      )}
    </div>
  );
};

export default FileUploader;
