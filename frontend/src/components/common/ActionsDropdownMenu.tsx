import { deletePost, PostSummaryDTO } from "@/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/states/auth-state";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ActionsDropdownMenu({ post }: { post: PostSummaryDTO }) {
  const { userDetails } = useAuthStore();
  const isOwner = userDetails?.id === post.author?.id;
  const isAdmin = userDetails?.roles?.some(
    (role) => role.name === "ROLE_ADMIN"
  );
  const canManagePost = isOwner || isAdmin;
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      if (post.id)
        await deletePost({
          path: {
            id: post.id,
          },
        });
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={!canManagePost}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      {canManagePost && (
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel>Управление постом</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigate(`/posts/${post.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Изменить
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}
