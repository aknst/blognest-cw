import { BlogDTO } from "@/client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buildImageUrl } from "@/lib/utils";
import { Ellipsis, User } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export const BlogCard: React.FC<{ blog: BlogDTO }> = ({ blog }) => {
  return (
    <Card className="flex flex-col flex-shrink basis-96 flex-grow hover:shadow-lg transition-all">
      <Link to={`/blog/${blog.id}`}>
        <CardHeader className="p-2 pl-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={buildImageUrl(blog.author?.avatarFileId)}
                  alt={blog.author?.username || "User"}
                />
                <AvatarFallback className="rounded-lg">
                  <User />
                </AvatarFallback>
              </Avatar>
              <span className={`font-semibold tracking-tight text-sm`}>
                {blog.author?.username}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span
                className={`font-semibold tracking-tight text-sm text-muted-foreground`}>
                {blog.author?.name}
              </span>
            </div>
            <Button variant="ghost" disabled>
              <Ellipsis />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 pt-2">
            <CardTitle className="scroll-m-20 text-xl font-bold tracking-tight">
              {blog.title}
            </CardTitle>
            <CardDescription>{blog.description}</CardDescription>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
