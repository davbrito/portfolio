import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";
import {
  TabProvider,
  Tab as AriakitTab,
  TabList as AriakitTabList,
  TabPanel as AriakitTabPanel,
  useTabStore,
} from "@ariakit/react";

export type TabsProps = HTMLAttributes<HTMLDivElement> & {
  defaultSelectedId?: string;
};

const tabsClass = cva("flex gap-2");
const tabClass = cva(
  "px-3 py-2 text-sm rounded-md border border-border bg-popover text-popover-foreground",
);

export function Tabs({
  className,
  defaultSelectedId,
  children,
  ...props
}: TabsProps) {
  const store = useTabStore({ defaultSelectedId });
  return (
    <TabProvider store={store}>
      <div className={cn(tabsClass(), className)} {...props}>
        {children}
      </div>
    </TabProvider>
  );
}

export type TabListProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};
export function TabList({ className, children, ...props }: TabListProps) {
  return (
    <AriakitTabList className={cn(tabsClass(), className)} {...props}>
      {children}
    </AriakitTabList>
  );
}

export type TabProps = HTMLAttributes<HTMLButtonElement> & { id: string };
export function Tab({ className, id, children, ...props }: TabProps) {
  return (
    <AriakitTab className={cn(tabClass(), className)} id={id} {...props}>
      {children}
    </AriakitTab>
  );
}

export type TabPanelProps = HTMLAttributes<HTMLDivElement> & { tabId: string };
export function TabPanel({
  className,
  tabId,
  children,
  ...props
}: TabPanelProps) {
  return (
    <AriakitTabPanel
      className={cn(
        "bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4",
        className,
      )}
      tabId={tabId}
      {...props}
    >
      {children}
    </AriakitTabPanel>
  );
}
