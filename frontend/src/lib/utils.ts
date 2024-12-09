import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildImageUrl(fileId: string | null | undefined): string {
  if (!fileId) {
    return ""; // Возвращаем пустую строку, если fileId не передан.
  }
  return `${import.meta.env.VITE_API_URL}/api/images/${fileId}`;
}

export function formatDateTime(createdAt: string | Date): string {
  const date = new Date(String(createdAt));
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const formattedTime = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} в ${formattedTime}`;
}

export const generateRandomGradient = () => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FFC300",
    "#DAF7A6",
    "#900C3F",
    "#581845",
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];
  const getRandomDegree = () => Math.floor(Math.random() * 360); // Угол от 0 до 360
  const gradientTypes = ["linear-gradient", "radial-gradient"];
  const getRandomGradientType =
    gradientTypes[Math.floor(Math.random() * gradientTypes.length)];

  if (getRandomGradientType === "linear-gradient") {
    return `${getRandomGradientType}(${getRandomDegree()}deg, ${getRandomColor()}, ${getRandomColor()})`;
  } else {
    return `${getRandomGradientType}(circle, ${getRandomColor()}, ${getRandomColor()})`;
  }
};
