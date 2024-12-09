import { PostSummaryDTO } from "@/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ActionsDropdownMenu } from "./ActionsDropdownMenu";
import PostMeta from "./PostMeta";
import TagList from "./TagList";
import { buildImageUrl, generateRandomGradient } from "@/lib/utils";
import { Link } from "react-router-dom";

export const PostCard: React.FC<{ post: PostSummaryDTO }> = ({ post }) => {
  const backgroundImage = post.coverFileId
    ? `url(${buildImageUrl(post.coverFileId)})`
    : generateRandomGradient();

  return (
    <Card className="flex flex-col flex-shrink basis-96 flex-grow hover:shadow-lg transition-all">
      <CardHeader className="p-2 pl-4">
        <div className="flex items-center justify-between">
          <PostMeta post={post} size="sm" />
          <ActionsDropdownMenu post={post} />
        </div>
      </CardHeader>
      <Link to={`/posts/${post.id}`}>
        <CardContent className="p-0">
          <div
            className="h-48 w-full"
            style={{
              backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-label={post.title || "No Title"}></div>
          <div className="p-2 px-4 pt-2">
            <CardTitle className="scroll-m-20 text-xl font-bold tracking-tight">
              {post.title}
            </CardTitle>
            <CardDescription>{post.brief}</CardDescription>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-2">
        {post.tags && <TagList tags={post.tags} size="sm" />}
      </CardFooter>
    </Card>
  );
};
