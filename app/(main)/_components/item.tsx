"use client";

import { 
  ChevronDown, 
  ChevronRight, 
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash
} from "lucide-react";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
// import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface ItemProps {
       id?: Id<"documents">;
       documentIcon?: string;
       active?: boolean;
       expanded?: boolean;
       isSearch?: boolean;
       level?: number;
       onExpand?: () => void;
       label: string;
       onClick?: () => void;
       icon: LucideIcon;
     };
export const Item=({
       id,
       label,
       onClick,
       icon: Icon,
       active,
       documentIcon,
       isSearch,
       level = 0,
       onExpand,
       expanded,
     }: ItemProps) => {

      const ChevronIcon = expanded ? ChevronDown : ChevronRight;

       return (
              <div
      onClick={onClick}
      role="button"
      style={{ 
        paddingLeft: level ? `${(level * 12) + 12}px` : "12px"
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
        role="button"
        className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
        onClick={()=>{}}
      >
        <ChevronIcon
          className="h-4 w-4 shrink-0 text-muted-foreground/50"
        />
      </div>
      )}
      {documentIcon ? (
        <div>
          {documentIcon}
        </div>
      ): (

        <Icon 
        className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"
        />
      )}
        <span> {label}</span>
       {isSearch && (
       <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
       <span className="text-xs">⌘</span>K
     </kbd>
       )}

              </div>
       )
}