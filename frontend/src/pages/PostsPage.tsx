import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllPosts, getPostsByTag, PostSummaryDTO } from "@/client";
import { PostCards } from "@/components/common/PostCards";
import CardLayout from "@/components/layouts/CardLayout";
import { Spinner } from "@/components/ui/spinner";

function PostsPage() {
  const [posts, setPosts] = useState<PostSummaryDTO[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const tag = searchParams.get("tag");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (tag) {
          const fetchedPosts = await getPostsByTag({
            query: {
              tag: tag,
            },
          });
          setPosts(fetchedPosts.data?.content);
        } else {
          const fetchedPosts = await getAllPosts();
          setPosts(fetchedPosts.data?.content);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [tag]);

  const title = tag ? `Посты по тегу "${tag}"` : "Последние публикации";
  const description = tag
    ? `На этой странице отображены посты, связанные с тегом "${tag}".`
    : "На этой странице отображены последние публикации в блогах.";

  return (
    <CardLayout title={title} description={description}>
      {loading ? (
        <Spinner />
      ) : posts ? (
        <PostCards posts={posts} />
      ) : (
        <p>Посты не найдены.</p>
      )}
    </CardLayout>
  );
}

export default PostsPage;
