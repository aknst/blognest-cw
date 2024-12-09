import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BlogPostForm from "../components/forms/BlogPostForm";
import { toast } from "sonner";
import {
  createPostForCurrentUser,
  getPostById,
  updatePost,
} from "@/client/services.gen";
import { PostDTO } from "@/client";
import CardLayout from "@/components/layouts/CardLayout";
import { useAuthStore } from "@/states/auth-state";
import { ForbiddenPage } from "./misc/ForbiddenPage";
import { FullPageLoader } from "./misc/FullLoaderPage";

export default function BlogPostFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDTO | undefined>(undefined);
  const { userDetails } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const isEditMode = !!id;

  const fetchPost = async () => {
    setLoading(true);
    try {
      const result = await getPostById({
        path: {
          id: parseInt(id || "", 10),
        },
      });
      if (result.data) setPost(result.data);
    } catch (error) {
      toast.error("Не удалось загрузить данные поста.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id, isEditMode]);

  const handleSave = async (data: PostDTO) => {
    try {
      if (isEditMode) {
        await updatePost({
          path: {
            id: parseInt(id || "0", 10),
          },
          body: data,
        });
        toast.success("Запись успешно обновлена.");
      } else {
        await createPostForCurrentUser({ body: data });
        toast.success("Запись успешно создана.");
      }
      navigate("/blog");
    } catch (error) {
      toast.error("Не удалось сохранить запись.");
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  if (isEditMode) {
    if (userDetails && userDetails.id != post?.author?.id) {
      if (!userDetails?.roles?.some((role) => role.name === "ROLE_ADMIN"))
        return <ForbiddenPage />;
    }
  }

  return (
    <CardLayout
      title={isEditMode ? "Редактирование записи" : "Создание новой записи"}
      description={
        isEditMode
          ? "Вы можете изменить существующую запись, внеся необходимые правки."
          : "Заполните форму, чтобы создать новую запись."
      }>
      <BlogPostForm post={post} onSave={handleSave} />
    </CardLayout>
  );
}
