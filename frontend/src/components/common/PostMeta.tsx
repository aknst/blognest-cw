import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { User } from "lucide-react";
import { buildImageUrl, formatDateTime } from "@/lib/utils";
import { PostDTO, PostSummaryDTO } from "@/client";
import { Link } from "react-router-dom";

type PostMetaProps = {
  post: PostSummaryDTO | PostDTO;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: {
    avatar: "h-6 w-6",
    font: "text-sm",
    separator: "h-4",
  },
  md: {
    avatar: "h-8 w-8",
    font: "text-base",
    separator: "h-5",
  },
  lg: {
    avatar: "h-10 w-10",
    font: "text-lg",
    separator: "h-6",
  },
};

const PostMeta: React.FC<PostMetaProps> = ({ post, size = "md" }) => {
  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <Link to={`/blog/${post.author?.blogId}`}>
        <div className="flex items-center gap-2">
          <Avatar className={classes.avatar}>
            <AvatarImage
              src={buildImageUrl(post.author?.avatarFileId)}
              alt={post.author?.username || "User"}
            />
            <AvatarFallback className="rounded-lg">
              <User />
            </AvatarFallback>
          </Avatar>
          <span
            className={`font-semibold tracking-tight ${classes.font} hover:text-muted-foreground transition-all`}>
            {post.author?.username}
          </span>
        </div>
      </Link>
      <Separator orientation="vertical" className={classes.separator} />
      <span className={`tracking-tight ${classes.font} text-muted-foreground`}>
        {formatDateTime(String(post.createdAt))}
      </span>
    </div>
  );
};

export default PostMeta;
