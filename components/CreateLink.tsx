"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation, gql } from "@apollo/client";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink: React.FC = () => {
  const router = useRouter();
  const [formState, setFormState] = useState<{
    description: string;
    url: string;
  }>({
    description: "",
    url: "",
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    onCompleted: () => {
      router.push("/");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    createLink();
    console.log("Submitted:", formState);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mt-3">
          <input
            className="mb-2 p-2 border rounded"
            name="description"
            value={formState.description}
            onChange={handleChange}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb-2 p-2 border rounded"
            name="url"
            value={formState.url}
            onChange={handleChange}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 mt-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateLink;
