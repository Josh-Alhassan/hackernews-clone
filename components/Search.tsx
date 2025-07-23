"use client";

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import Link from "./Link";

interface User {
  id: string;
  name: string;
}

interface Vote {
  id: string;
  user: User;
}

interface LinkType {
  id: string;
  url: string;
  description: string;
  createdAt: string;
  postedBy: User;
  votes: Vote[];
}

interface FeedData {
  feed: {
    id: string;
    links: LinkType[];
  };
}

interface FeedVars {
  filter: string;
}

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        id
        url
        description
        createdAt
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

const Search: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [executeSearch, { data }] = useLazyQuery<FeedData, FeedVars>(
    FEED_SEARCH_QUERY
  );

  return (
    <>
      <div>
        Search
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter },
            })
          }
        >
          OK
        </button>
      </div>

      {data?.feed.links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </>
  );
};

export default Search;
