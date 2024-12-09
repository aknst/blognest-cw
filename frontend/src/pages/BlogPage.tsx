import {
  BlogDTO,
  getBlogById,
  getBlogForCurrentUser,
  getBlogPosts,
  PostSummaryDTO,
} from "@/client";
import { PostCards } from "@/components/common/PostCards";
import EditBlogDialog from "@/components/dialogs/EditBlogDialog";
import CardLayout from "@/components/layouts/CardLayout";
import { useAuthStore } from "@/states/auth-state";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullPageLoader } from "./misc/FullLoaderPage";
import { NotFoundPage } from "./misc/NotFoundPage";

const BlogPage: React.FC<{ owner: boolean }> = ({ owner }) => {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogDTO>();
  const [posts, setPosts] = useState<PostSummaryDTO[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(owner);
  const { userDetails } = useAuthStore();

  const updateBlog = async (updatedBlog: BlogDTO) => {
    setBlog(updatedBlog);
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);

        let fetchedBlog;

        if (id) {
          fetchedBlog = await getBlogById({ path: { id } });
        } else {
          fetchedBlog = await getBlogForCurrentUser({});
        }

        setBlog(fetchedBlog.data);
        setIsOwner(
          fetchedBlog.data?.author?.username === userDetails?.username
        );
        if (fetchedBlog.data?.id) {
          const fetchedPosts = await getBlogPosts({
            path: { id: fetchedBlog.data.id },
          });
          setPosts(fetchedPosts.data?.content);
        }
      } catch (error) {
        console.error("Error fetching blog data:", error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id, userDetails]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!blog) {
    return <NotFoundPage />;
  }

  return (
    <CardLayout
      title={blog?.title}
      description={blog?.description}
      header={isOwner && <EditBlogDialog blog={blog} onUpdate={updateBlog} />}>
      {posts && <PostCards posts={posts} />}
    </CardLayout>
  );
};

export default BlogPage;
