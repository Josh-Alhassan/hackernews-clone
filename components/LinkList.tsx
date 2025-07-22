"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "./Link";

const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

type LinkType = {
  id: string;
  description: string;
  url: string;
  createdAt?: string;
};

type FeedQueryData = {
  feed: {
    id: string;
    links: LinkType[];
  };
};

const LinkList = () => {
  const { data, loading, error } = useQuery<FeedQueryData>(FEED_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading links.</p>;

  return (
    <div className="space-y-4">
      {data?.feed.links.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </div>
  );
};

export default LinkList;
