"use client";

import React, { useEffect } from "react";
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

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
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
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`;

// ----------------------
// Type Definitions
// ----------------------

type LinkType = {
  id: string;
  description: string;
  url: string;
  createdAt: string;
  postedBy?: {
    id: string;
    name: string;
  };
  votes: {
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
    __typename?: string;
  };
};

type NewLinkData = {
  newLink: LinkType;
};

type NewVoteData = {
  newVote: {
    id: string;
    link: LinkType;
    user: {
      id: string;
    };
  };
};

// ----------------------
// Component
// ----------------------

const LinkList: React.FC = () => {
  const { data, loading, error, subscribeToMore } =
    useQuery<FeedQueryData>(FEED_QUERY);

  useEffect(() => {
    const unsubscribeNewLink = subscribeToMore<NewLinkData>({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.some(({ id }) => id === newLink.id);
        if (exists) return prev;

        return {
          ...prev,
          feed: {
            ...prev.feed,
            links: [newLink, ...prev.feed.links],
          },
        };
      },
    });

    const unsubscribeNewVote = subscribeToMore<NewVoteData>({
      document: NEW_VOTES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const updatedLink = subscriptionData.data.newVote.link;

        return {
          ...prev,
          feed: {
            ...prev.feed,
            links: prev.feed.links.map((link) =>
              link.id === updatedLink.id ? updatedLink : link
            ),
          },
        };
      },
    });

    return () => {
      unsubscribeNewLink();
      unsubscribeNewVote();
    };
  }, [subscribeToMore]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading links.</p>;

  return (
    <div className="pa4">
      {data?.feed.links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </div>
  );
};

export default LinkList;
