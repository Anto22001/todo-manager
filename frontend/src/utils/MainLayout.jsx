import { Outlet } from "react-router-dom";
import { Sidebar, Footer } from "../components";

function MainLayout() {
  return (
    <div className="h-screen w-full flex items-center flex-col">
      <div className="p-10 w-full" style={{ maxWidth: "1280px" }}>
        <Sidebar />

        <div className="top-0 right-0 w-full flex justify-center pt-6">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;
