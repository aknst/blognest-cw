import React from "react";
import { Badge } from "../ui/badge";
import { TagDTO } from "@/client";
import { Link } from "react-router-dom";

type TagListProps = {
  tags: TagDTO[];
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

const TagList: React.FC<TagListProps> = ({ tags, size = "md" }) => {
  const badgeClass = `${sizeClasses[size]} transition-colors hover:bg-primary hover:text-white dark:hover:bg-primary-dark dark:hover:text-black`;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(
        (tag) =>
          tag.text && (
            <Link
              to={`/posts?tag=${encodeURIComponent(tag.text)}`}
              key={tag.id}>
              <Badge variant="secondary" className={badgeClass}>
                {tag.text}
              </Badge>
            </Link>
          )
      )}
    </div>
  );
};

export default TagList;
