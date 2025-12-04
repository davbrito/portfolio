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

const tabsListClass = cva("bg-border flex gap-0.5 p-0.5");
const tabClass = cva(
  "border-border bg-card text-popover-foreground aria-selected:text-primary-foreground aria-selected:bg-primary hover:bg-card/80 flex-1 px-3 py-2 text-sm [&>svg]:mr-2 [&>svg]:inline-block",
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
      <div className={cn(className)} {...props}>
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
    <AriakitTabList className={cn(tabsListClass(), className)} {...props}>
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
    <AriakitTabPanel className={cn(className)} tabId={tabId} {...props}>
      {children}
    </AriakitTabPanel>
  );
}
