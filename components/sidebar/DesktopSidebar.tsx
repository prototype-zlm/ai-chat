// 桌面端侧边栏
import SidebarContent from "@/components/sidebar/SidebarContent";

export default function DesktopSidebar() {
  return (
    <div className="hidden md:block">
      <SidebarContent />
    </div>
  );
}