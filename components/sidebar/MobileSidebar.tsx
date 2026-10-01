// 移动端侧边栏
import SidebarContent from "@/components/sidebar/SidebarContent";

interface MobileSidebarProps {
  isOpenMenu: boolean;
  setIsOpenMenu: (isOpenMenu: boolean) => void;
}

export default function MobileSidebar({
  isOpenMenu,
  setIsOpenMenu,
}: MobileSidebarProps) {
  return (
    <div
      className={`md:hidden fixed top-0 left-0 right-0 bottom-0 z-10 bg-gray-200/50 transition-transform duration-300 
      ${isOpenMenu ? "translate-x-0" : "-translate-x-full"}`}
      onClick={() => setIsOpenMenu(false)}
    >
      <SidebarContent />
    </div>
  );
}
