import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BlogDTO, updateBlog } from "@/client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const blogFormSchema = z.object({
  title: z.string().min(2, {
    message: "Название блога должно содержать не менее 2 символов.",
  }),
  description: z.string(),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export function EditBlogForm({
  blog,
  className,
  onUpdate,
}: {
  blog: BlogDTO;
  className?: string;
  onUpdate: (updatedBlog: BlogDTO) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog.title,
      description: blog.description || "",
    },
    mode: "onChange",
  });

  const handleSubmit = (data: BlogFormValues) => {
    onSubmit(data);
  };

  async function onSubmit(data: BlogFormValues) {
    setIsLoading(true);

    try {
      if (blog.id) {
        let result = await updateBlog({
          path: { id: blog.id },
          body: data,
        });
        if (result.data) {
          await onUpdate(result.data);
          form.reset({
            title: result.data.title,
            description: result.data.description || "",
          });
        }
        toast.success("Блог успешно обновлен.");
      }
    } catch (error) {
      toast.error("Не удалось обновить блог.");
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)} // Используем кастомный handleSubmit
        className={cn("space-y-4", className)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название блога</FormLabel>
              <FormControl>
                <Input placeholder="Название блога" {...field} />
              </FormControl>
              <FormDescription>Введите название блога.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание блога</FormLabel>
              <FormControl>
                <Textarea placeholder="Описание блога" {...field} />
              </FormControl>
              <FormDescription>Введите описание блога.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isLoading ? <Loader2 className="animate-spin" /> : "Обновить блог"}
        </Button>
      </form>
    </Form>
  );
}
