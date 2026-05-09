import { ClientOnly, createFileRoute } from '@tanstack/solid-router'
import { postQueryOptions } from '../utils/posts'
import { NotFound } from '~/components/NotFound'
import { PostErrorComponent } from '~/components/PostError'
import { userLikeQueryOptions, userLikeQueryPreloadLinks } from '~/utils/users'
import { useQuery } from '@tanstack/solid-query'
import { UserLike } from '~/components/UserLike'
import { isServer, Suspense } from 'solid-js/web'

export const Route = createFileRoute('/_layout/posts/$postId')({
  loader: async ({ params: { postId }, context }) => {
    const promises: Promise<unknown>[] = [];
    promises.push(context.queryClient.ensureQueryData(postQueryOptions(postId)));
    if (!isServer) {
      promises.push(context.queryClient.ensureQueryData(userLikeQueryOptions(postId)));
    }
    await Promise.all(promises);
  },
  errorComponent: PostErrorComponent,
  component: PostComponent,
  notFoundComponent: () => {
    return <NotFound>Post not found</NotFound>
  },
  // Make the page publicly cacheable
  headers: async () => ({
    'cache-control': 'public, max-age=600',
  }),
  head: async ({ params }) => ({
    // Only add <link rel=preload> tag on initial server render
    links: isServer ? await userLikeQueryPreloadLinks(params.postId) : [],
  }),
})

function PostComponent() {
  const params = Route.useParams()
  const postId = () => params().postId;
  const post = useQuery(() => postQueryOptions(postId()))

  return (
    <div class="space-y-2">
      <h4 class="text-xl font-bold underline">
        {post.data?.title}
        {' '}
        <ClientOnly fallback='⌛'>
          <Suspense fallback='⌛'>
            <UserLike postId={postId()} />
          </Suspense>
        </ClientOnly>
      </h4>
      <div class="text-sm">{post.data?.body}</div>
    </div>
  )
}
