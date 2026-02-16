import BottomNav from "./BottomNav";
import TopNav from "./TopNav";

export default function Layout({ children }) {
  return (
    <>
    
    <div className="bg-gray-100 min-h-screen flex justify-center">
        <TopNav />
      <div className="w-full max-w-[375px] bg-gray-50 min-h-screen relative">
        

        {/* Page Content */}
        <div className="pb-24 px-4 pt-6">
          {children}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
    </>
  );
}
