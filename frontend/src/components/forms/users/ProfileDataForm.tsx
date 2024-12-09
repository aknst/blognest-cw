import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { toast } from "sonner";
import { updateCurrentUser, uploadImage } from "@/client/services.gen";
import { UserDTO } from "@/client/types.gen";
import { buildImageUrl } from "@/lib/utils";

const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Имя должно содержать не менее 2 символов." }),
  username: z
    .string()
    .min(2, { message: "Имя пользователя должно быть не менее 2 символов." }),
  avatar: z.instanceof(File).optional(),
});

type ProfileUpdateValues = z.infer<typeof profileUpdateSchema>;

type ProfileDataFormProps = {
  user: UserDTO | null;
  onUpdate?: () => Promise<void>;
};

export const ProfileDataForm: React.FC<ProfileDataFormProps> = ({
  user,
  onUpdate,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileUpdateValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
    },
  });

  useEffect(() => {
    if (user?.avatarFileId) {
      setPreview(buildImageUrl(user?.avatarFileId));
    }
  }, [user?.avatarFileId]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("avatar", file);
    }
  };

  const onSubmit = async (data: ProfileUpdateValues) => {
    setIsLoading(true);
    try {
      let avatarFileId = user?.avatarFileId;

      if (data.avatar) {
        const uploadResponse = await uploadImage({
          body: { file: data.avatar },
        });
        avatarFileId = uploadResponse.data?.id;
      }

      await updateCurrentUser({
        body: {
          name: data.name,
          username: data.username,
          avatarFileId,
        },
      });

      toast.success("Данные пользователя успешно обновлены.");
      if (onUpdate) await onUpdate();
    } catch (error) {
      toast.error("Не удалось обновить данные пользователя.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md">
        <div className="relative flex gap-6 items-center">
          <Avatar className="w-24 h-24">
            {preview ? (
              <AvatarImage src={preview} alt="User Avatar" />
            ) : (
              <AvatarFallback>U</AvatarFallback>
            )}
          </Avatar>
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex flex-col gap-2">Аватар</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleAvatarChange(e);
                      field.onChange(e.target.files?.[0]);
                    }}
                  />
                </FormControl>
                <FormDescription>Выберите изображение.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="ivanivanov" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Обновить"}
        </Button>
      </form>
    </Form>
  );
};
