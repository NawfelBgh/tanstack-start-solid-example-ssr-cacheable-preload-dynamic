import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/solid-router'
import { postsQueryOptions } from '../utils/posts'
import { useQuery } from '@tanstack/solid-query'
import { For } from 'solid-js';
import { isServer } from 'solid-js/web';

export const Route = createFileRoute('/_layout/posts')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(postsQueryOptions())
  },
  head: () => ({
    meta: [{ title: 'Posts' }],
  }),
  component: PostsComponent,
});

function PostsComponent() {
  const postsQuery = useQuery(() => postsQueryOptions());
  const routerStatus = useRouterState({ select: (s) => s.status });
  // Note: when the page is rendered on the server side, routerStatus is pending
  // routerStatus does not change to idle, on page load on the client
  // hence the isServer check
  const isNavigatingAway = () => routerStatus() === 'pending' && !isServer;

  return (
    <div class="p-2 flex gap-2">
      <ul class="list-disc pl-4">
        <For each={[
          ...postsQuery.data ?? [],
          { id: 'i-do-not-exist', title: 'Non-existent Post' },
        ]}>
          {(post) => {
            return (
              <li class="whitespace-nowrap">
                <Link
                  to="/posts/$postId"
                  params={{
                    postId: post.id,
                  }}
                  class="block py-1 text-blue-800 hover:text-blue-600"
                  activeProps={{ class: 'text-black font-bold' }}
                >
                  <div>{post.title.substring(0, 20)}</div>
                </Link>
              </li>
            )
          }}
        </For>
      </ul>
      <hr />
      <div class={(isNavigatingAway() ? ' opacity-50' : '')}>
        <Outlet/>
      </div>
    </div>
  )
}
