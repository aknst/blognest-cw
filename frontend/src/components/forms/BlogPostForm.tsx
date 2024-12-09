import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Tag, TagInput } from "emblor";
import { PostDTO, uploadImage } from "@/client";
import { Textarea } from "../ui/textarea";
import { buildImageUrl } from "@/lib/utils";
import { Card } from "../ui/card";
import { Editor } from "@tinymce/tinymce-react";

const blogPostSchema = z.object({
  title: z.string().min(2, "Заголовок должен содержать минимум 2 символа."),
  brief: z
    .string()
    .min(10, "Краткое описание должно содержать минимум 10 символов."),
  content: z.string().min(10, "Контент должен содержать минимум 10 символов."),
  tags: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, "Имя тега не может быть пустым."),
    })
  ),
  coverFileId: z.string().optional(),
});

type BlogPostValues = z.infer<typeof blogPostSchema>;

export default function BlogPostForm({
  post,
  onSave,
}: {
  post?: PostDTO;
  onSave: (data: BlogPostValues) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = React.useState<Tag[]>((post?.tags as Tag[]) || []);
  const [activeTagIndex, setActiveTagIndex] = React.useState<number | null>(
    null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    post?.coverFileId ? buildImageUrl(post.coverFileId) : null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<BlogPostValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || "",
      brief: post?.brief || "",
      content: post?.content || "",
      tags: post?.tags,
      coverFileId: post?.coverFileId || undefined,
    },
  });

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };
  // const editor = useEditor({
  //   extensions: [StarterKit],
  //   content: post?.content || "",
  //   onUpdate: ({ editor }) => {
  //     form.setValue("content", editor.getHTML());
  //   },
  // });

  const handleEditorChange = (newContent: string) => {
    form.setValue("content", newContent);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    form.setValue("coverFileId", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (data: BlogPostValues) => {
    setIsSubmitting(true);

    try {
      let file = fileInputRef.current?.files?.[0];
      if (file) {
        const uploadResponse = await uploadImage({
          body: { file: file },
        });
        form.setValue("coverFileId", uploadResponse.data?.id);
      }
      await onSave(form.getValues());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="flex gap-6 flex-wrap">
          <div className="flex-initial w-max">
            {/* Поле обложки */}
            <FormField
              control={form.control}
              name="coverFileId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Обложка</FormLabel>
                  <div className="relative flex flex-col gap-4 items-left">
                    <Card className="max-w-md w-full border">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Обложка поста"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-48 flex items-center justify-center rounded-md">
                          <span className="text-muted-foreground">
                            Нет обложки
                          </span>
                        </div>
                      )}
                    </Card>
                    <div className="flex space-x-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleCoverChange(e);
                        }}
                      />
                      {coverPreview && (
                        <Button variant="outline" onClick={handleRemoveCover}>
                          {"Удалить обложку"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4 flex-grow">
            {/* Поле заголовка */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Заголовок</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите заголовок" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Поле краткого описания */}
            <FormField
              control={form.control}
              name="brief"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Краткое описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Краткое описание записи"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Поле тегов */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Теги</FormLabel>
                  <FormControl>
                    <TagInput
                      {...field}
                      placeholder="Введите теги"
                      tags={tags}
                      setTags={(newTags) => {
                        setTags(newTags);
                        form.setValue("tags", newTags as [Tag, ...Tag[]]);
                      }}
                      activeTagIndex={activeTagIndex}
                      setActiveTagIndex={setActiveTagIndex}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Поле контента */}
        <div>
          <FormLabel>Контент</FormLabel>
          <Editor
            apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
            initialValue={post?.content || ""}
            onEditorChange={handleEditorChange}
            init={{
              height: 360,
              menubar: false,
              plugins: "link image code",
              toolbar:
                "undo redo | formatselect | bold italic | alignleft aligncenter alignright | code",
            }}
          />
          <FormMessage />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : "Сохранить"}
        </Button>
      </form>
    </Form>
  );
}
