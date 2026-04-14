import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

const AiMockupsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full dark:bg-[#1F1F1F]">
      <div className="z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6 border-b shadow-sm">
        <Link href="/" className="hidden md:flex items-center gap-x-2">
          <Image
            src="/logo.svg"
            height="40"
            width="40"
            alt="Logo"
            className="dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            height="40"
            width="40"
            alt="Logo"
            className="hidden dark:block"
          />
          <p className={cn("font-semibold", font.className)}>Jotion</p>
        </Link>
        <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">← Back to Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/ai-mockups">AI Features</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
      <main className="h-full pt-24">{children}</main>
    </div>
  );
};

export default AiMockupsLayout;
