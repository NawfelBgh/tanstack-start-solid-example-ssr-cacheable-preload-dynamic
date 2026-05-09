import { useQuery } from "@tanstack/solid-query"
import { userQueryOptions } from "~/utils/users"

export function UserInfo() {
  const userInfo = useQuery(() => userQueryOptions());
  return <>
    <img src={userInfo.data?.profilePic} />
    <span>{userInfo.data?.name}</span>
  </>
}