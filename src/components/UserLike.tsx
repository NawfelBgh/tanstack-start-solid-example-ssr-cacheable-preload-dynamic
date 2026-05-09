import { useQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import { userLikeQueryOptions } from "~/utils/users";

export function UserLike(props: { postId: string }) {
  const userLike = useQuery(() => userLikeQueryOptions(props.postId));
  return <Show when={userLike.data} fallback='♡'>❤️</Show>;
}