"use client";

import React from "react";
import { gql, useMutation } from "@apollo/client";
import { AUTH_TOKEN } from "@/constants";
import { timeDifferenceForDate } from "@/utils";
import { FEED_QUERY } from "./LinkList";
import styles from "./Link.module.css";

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
    <div className={styles.linkContainer}>
      <div className={styles.voteSection}>
        <span>{index + 1}.</span>
        {authToken && (
          <button
            onClick={() => vote()}
            className={styles.voteButton}
            title="Vote"
          >
            ▲
          </button>
        )}
      </div>
      <div className={styles.linkContent}>
        <div className={styles.linkDescription}>
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.description}
          </a>{" "}
          <span className={styles.linkUrl}>({link.url})</span>
        </div>
        <div className={styles.metaInfo}>
          {link.votes.length} votes | by {link.postedBy?.name || "Unknown"}{" "}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;
