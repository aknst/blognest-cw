import { getPostById, PostDTO } from "@/client";
import PostMeta from "@/components/common/PostMeta";
import TagList from "@/components/common/TagList";
import CardLayout from "@/components/layouts/CardLayout";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { NotFoundPage } from "./misc/NotFoundPage";
import { buildImageUrl, generateRandomGradient } from "@/lib/utils";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDTO | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPostById({
          path: { id: parseInt(id || "0", 10) },
        });
        setPost(response.data);
      } catch (error) {
        toast.error("Не удалось загрузить данные поста.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!post) return <NotFoundPage />;

  const backgroundImage = post.coverFileId
    ? `url(${buildImageUrl(post.coverFileId)})`
    : generateRandomGradient();

  return (
    <CardLayout
      cover={
        <div
          className="h-72 w-full rounded-t-xl"
          style={{
            backgroundImage: backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-label={post.title}></div>
      }
      title={post.title}
      description={post.brief}
      header={
        <div className="flex flex-col gap-4">
          <PostMeta post={post} />
          {post.tags && <TagList tags={post.tags} />}
        </div>
      }>
      {post.content ? (
        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      ) : (
        <p>{post.brief}</p>
      )}
    </CardLayout>
  );
}
