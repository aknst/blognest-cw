import { BlogDTO } from "@/client";
import { BlogCard } from "./BlogCard";

export const BlogCards: React.FC<{ blogs: BlogDTO[] }> = ({ blogs }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};
