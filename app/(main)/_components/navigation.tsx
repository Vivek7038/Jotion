"use client";

import {
       ChevronsLeft,
       MenuIcon,
       Plus,
       PlusCircle,
       Search,
       Settings,
       Trash
} from "lucide-react";
import {TrashBox} from "./trash-box"
import { Item } from "./item"
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useState, useRef, ElementRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { UserItem } from "./user-item";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { FileIcon } from "lucide-react";
import { toast } from 'sonner';
import { DocumentList } from "./document-list";
import {
       Popover,
       PopoverTrigger,
       PopoverContent,
     } from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
const Navigation = () => {
       const search=useSearch();
       const settings=useSettings();
       const pathname = usePathname();
       const params=useParams();
       const documents = useQuery(api.documents.get);
       const create = useMutation(api.documents.create);
       const isMobile = useMediaQuery("(max-width : 768px)");
       const isResizingRef = useRef(false);
       const sidebarRef = useRef<ElementRef<"aside">>(null);
       const navbarRef = useRef<ElementRef<"div">>(null);
       const [isResetting, setIsResetting] = useState(false);
       const [isCollapsed, setIsCollapsed] = useState(isMobile);
  
       // to hide sidebar by default in mobile mode
       useEffect(() => {
              if (isMobile) {
                     collapse();
              } else {

                     ResetWidth();
              }
       }, [])
       useEffect(() => {

              if (isMobile) {
                     collapse();
              }
       }, [pathname, isMobile])
       //logic to control navbar width 
       const handleMouseDown = (
              event: React.MouseEvent<HTMLDivElement, MouseEvent>
       ) => {
              event.preventDefault();
              event.stopPropagation();

              isResizingRef.current = true;
              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
       };

       const handleMouseMove = (event: MouseEvent) => {
              if (!isResizingRef.current) return;
              let newWidth = event.clientX;

              if (newWidth < 240) newWidth = 240;
              if (newWidth > 480) newWidth = 480;

              if (sidebarRef.current && navbarRef.current) {
                     sidebarRef.current.style.width = `${newWidth}px`;
                     navbarRef.current.style.setProperty("left", `${newWidth}px`);
                     navbarRef.current.style.setProperty("width", `calc(100% - ${newWidth}px)`);
              }
       };

       const handleMouseUp = () => {
              isResizingRef.current = false;
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
       };
       const ResetWidth = () => {
              if (sidebarRef.current && navbarRef.current) {
                     setIsCollapsed(false);
                     setIsResetting(true);

                     sidebarRef.current.style.width = isMobile ? "100%" : "240px";
                     navbarRef.current.style.setProperty(
                            "width",
                            isMobile ? "0" : "calc(100% - 240px)"
                     );
                     navbarRef.current.style.setProperty(
                            "left",
                            isMobile ? "100%" : "240px"
                     );
                     setTimeout(() => setIsResetting(false), 300);
              }
       }


       //
       const collapse = () => {
              if (sidebarRef.current && navbarRef.current) {
                     setIsCollapsed(true);
                     setIsResetting(true);

                     sidebarRef.current.style.width = "0";
                     navbarRef.current.style.setProperty("width", "100%");
                     navbarRef.current.style.setProperty("left", "0");
                     setTimeout(() => setIsResetting(false), 300);
              }
       }
       // to create new document 
       const handleCreate = () => {
              const promise = create({
                     title: "Untitled"
              });
              toast.promise(promise, {
                     loading: "Creating a new note ...",
                     success: "New note created!",
                     error: "Failed to create a new note"
              })
       }

       return (

              <>
                     <aside
                            ref={sidebarRef}
                            className={cn(
                                   "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
                                   isResetting && "transition-all ease-in-out duration-300",
                                   isMobile && "w-0"
                            )}
                     >
                            <div
                                   onClick={collapse}
                                   role="button"
                                   className={cn(
                                          "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
                                          isMobile && "opacity-100"
                                   )}
                            >
                                   <ChevronsLeft onClick={ResetWidth} className="h-6 w-6" />
                            </div>
                            <div>
                                   <UserItem />
                                   <Item
                                          onClick={search.onOpen}
                                          label="Search"
                                          isSearch
                                          icon={Search}
                                   />
                                   <Item
                                          onClick={settings.onOpen}
                                          label="Settings"
                                          icon={Settings}
                                   />
                                   <Item
                                          onClick={handleCreate}
                                          label="New Page"
                                          icon={PlusCircle}
                                   />

                            </div>
                            <div className="mt-4">
                                   <DocumentList />
                                   <Item
                                          onClick={handleCreate}
                                          icon={Plus}
                                          label="Add a page"
                                   />
                                             <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
             <TrashBox/>
            </PopoverContent>
          </Popover>

                            </div>
                            <div
                                   onMouseDown={handleMouseDown}
                                   onClick={ResetWidth}
                                   className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                            />
                     </aside>
                     <div
                            ref={navbarRef}
                            className={cn(
                                   "absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]",
                                   isResetting && "transition-all ease-in-out duration-300",
                                   isMobile && "left-0 w-full"
                            )}
                     >

                            <nav className="bg-transparent px-3 py-2 w-full">
                                   {isCollapsed && <MenuIcon onClick={ResetWidth} role="button" className="h-6 w-6 text-muted-foreground" />}
                            </nav>

                     </div>
              </>

       );
}

export default Navigation;