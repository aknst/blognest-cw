import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { EditBlogForm } from "../forms/EditBlogForm";
import { BlogDTO } from "@/client";

export default function EditBlogDialog({
  blog,
  onUpdate,
}: {
  blog: any;
  onUpdate: (updatedBlog: BlogDTO) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Редактировать блог</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Редактировать блог</DialogTitle>
          <DialogDescription>Обновите информацию о блоге.</DialogDescription>
        </DialogHeader>
        <EditBlogForm blog={blog} onUpdate={onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
