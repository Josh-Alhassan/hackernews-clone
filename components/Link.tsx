"use client";

import React from "react";
import { gql, useMutation } from "@apollo/client";
import { AUTH_TOKEN } from "@/constants";
import { timeDifferenceForDate } from "@/utils";
import { FEED_QUERY } from "./LinkList";

export const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
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

type Vote = {
  id: string;
  user: {
    id: string;
  };
};

type PostedBy = {
  id: string;
  name: string;
};

type LinkType = {
  id: string;
  description: string;
  url: string;
  createdAt: string;
  postedBy?: PostedBy;
  votes: Vote[];
};

type LinkProps = {
  link: LinkType;
  index: number;
};

const Link: React.FC<LinkProps> = ({ link, index }) => {
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN) : null;

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: { linkId: link.id },
    update: (cache, { data }) => {
      const newVote = data?.vote;
      if (!newVote) return;

      const existingData = cache.readQuery<{ feed: { links: LinkType[] } }>({
        query: FEED_QUERY,
      });

      if (!existingData) return;

      const updatedLinks = existingData.feed.links.map((feedLink) =>
        feedLink.id === link.id
          ? { ...feedLink, votes: [...feedLink.votes, newVote] }
          : feedLink
      );

      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            ...existingData.feed,
            links: updatedLinks,
          },
        },
      });
    },
  });

  return (
    <div className="flex items-start space-x-2 mt-3">
      <div className="flex items-center space-x-1 text-gray-500 text-sm">
        <span>{index + 1}.</span>
        {authToken && (
          <button
            onClick={() => vote()}
            className="hover:text-gray-800 focus:outline-none"
            title="Vote"
          >
            ▲
          </button>
        )}
      </div>
      <div className="flex flex-col">
        <div className="text-sm text-gray-900">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {link.description}
          </a>{" "}
          <span className="text-gray-500 text-xs">({link.url})</span>
        </div>
        <div className="text-xs text-gray-500">
          {link.votes.length} votes | by {link.postedBy?.name || "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
