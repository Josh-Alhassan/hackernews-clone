"use client";

import React from "react";
import { useQuery, gql } from "@apollo/client";
import Link from "./Link";

export const FEED_QUERY = gql`
  query FeedQuery {
    feed {
      id
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

type LinkType = {
  id: string;
  description: string;
  url: string;
  createdAt?: string;
  postedBy?: {
    id: string;
    name: string;
  };
  votes?: {
    id: string;
    user: {
      id: string;
    };
  }[];
};

type FeedQueryData = {
  feed: {
    id: string;
    links: LinkType[];
  };
};

const LinkList: React.FC = () => {
  const { data, loading, error } = useQuery<FeedQueryData>(FEED_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading links.</p>;

  return (
    <div className="pa4">
      {data?.feed.links.map((link, index) => (
        <Link key={link.id} link={{ ...link }} index={index} />
      ))}
    </div>
  );
};

export default LinkList;
