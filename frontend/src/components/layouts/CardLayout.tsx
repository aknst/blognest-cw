import { Card, CardContent, CardHeader } from "../ui/card";
import { Separator } from "../ui/separator";

type CardLayoutProps = {
  cover?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  header?: React.ReactNode;
};

const CardLayout: React.FC<CardLayoutProps> = ({
  title,
  description,
  children,
  header,
  cover,
}) => {
  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <Card>
        {cover}
        <CardHeader className="p-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {header && <div>{header}</div>}
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </div>
  );
};

export default CardLayout;
