import { useEffect, useState } from "react";
import { getAllBlogs, BlogDTO } from "@/client";
import { BlogCards } from "@/components/common/BlogCards";
import CardLayout from "@/components/layouts/CardLayout";
import { Spinner } from "@/components/ui/spinner";

function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogDTO[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const fetchedBlogs = await getAllBlogs();
        setBlogs(fetchedBlogs.data?.content);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const title = "Все блоги";
  const description = "На этой странице отображены все блоги.";

  return (
    <CardLayout title={title} description={description}>
      {loading ? (
        <Spinner />
      ) : blogs ? (
        <BlogCards blogs={blogs} />
      ) : (
        <p>Блоги не найдены.</p>
      )}
    </CardLayout>
  );
}

export default BlogsPage;
