import { PostSummaryDTO } from "@/client";
import { PostCard } from "./PostCard";

export const PostCards: React.FC<{ posts: PostSummaryDTO[] }> = ({ posts }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};
