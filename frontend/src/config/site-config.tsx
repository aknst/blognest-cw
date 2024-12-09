import { BookOpen, BookOpenCheck, BookPlus, Box } from "lucide-react";

export const team = {
  name: "Blognest CMS",
  logo: <Box className="size-4" />,
  plan: "Система блогов",
  url: "/",
};

export const navData = {
  navMain: [
    {
      title: "Последние публикации",
      url: "/",
      icon: BookPlus,
      items: [],
    },
    {
      title: "Все блоги",
      url: "/blogs",
      icon: BookOpen,
    },
  ],
  navAdmin: [
    {
      title: "Мой блог",
      url: "/blog",
      icon: BookOpenCheck,
      items: [],
    },
  ],
};

export const navTemp = {
  navMain: [
    { url: "/", title: "Главная" },
    { url: "/posts", title: "Посты" },
    { url: "/posts/:id", title: "Детали поста" },
  ],
  navAdmin: [
    { url: "/create", title: "Создание поста" },
    { url: "/posts/:id/edit", title: "Редактирование поста" },
    { url: "/settings", title: "Настройки профиля" },
  ],
  navBlogs: [
    { url: "/blogs", title: "Блоги" },
    { url: "/blog", title: "Мой блог" },
    { url: "/blog/:id", title: "Блог пользователя" },
  ],
};
