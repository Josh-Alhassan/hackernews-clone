"use client";

import React from "react";

type LinkProps = {
  link: {
    id: string;
    description: string;
    url: string;
  };
};

export default function Link({ link }: LinkProps) {
  return (
    <div className="p-2">
      <div className="text-gray-800">
        {link.description} (
        <a href={link.url} className="text-blue-600 underline">
          {link.url}
        </a>
        )
      </div>
    </div>
  );
}
