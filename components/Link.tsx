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

export default function Link({ link, index }: LinkProps) {
  const authToken =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN) : null;

  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: link.id,
    },
    update: (cache, { data }) => {
      const vote = data?.vote;
      if (!vote) return;

      const existingData: any = cache.readQuery({
        query: FEED_QUERY,
      });

      if (!existingData) return;

      const updatedLinks = existingData.feed.links.map((feedLink: LinkType) =>
        feedLink.id === link.id
          ? {
              ...feedLink,
              votes: [...feedLink.votes, vote],
            }
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
    <div className="flex mt-2 items-start">
      <div className="flex items-center">
        <span className="text-gray-500">{index + 1}.</span>
        {authToken && (
          <div
            className="ml-1 text-gray-500 text-xs cursor-pointer"
            onClick={() => vote()}
          >
            ▲
          </div>
        )}
      </div>
      <div className="ml-1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="text-sm leading-tight text-gray-500">
          {link.votes.length} votes | by {link.postedBy?.name || "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
}
