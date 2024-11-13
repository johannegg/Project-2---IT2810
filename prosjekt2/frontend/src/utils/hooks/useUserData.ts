import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../Queries";
import { useEffect } from "react";
import { SongData } from "../types/SongTypes";

export const useUserData = (username: string) => {
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER, {
    variables: { username },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (username) {
      createUser(); // Run the mutation to create the user when username is provided
    }
  }, [username, createUser]);

  useEffect(() => {
    if (data) {
      const favoriteSongs: SongData[] = data.createUser.favoriteSongs || [];
      console.log(data)
      
      localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
    }
  }, );

  return { loading, error, user: data ? data.createUser : null };
};
