import { useNavigate } from "react-router-dom";
import { Code2 } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Code2 className="w-7 h-7 text-neon-blue" />
          <span className="text-xl font-bold tracking-tight">
            Omni<span className="gradient-text">Code</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/workspace")}
            className="px-5 py-2 rounded-lg gradient-primary text-primary-foreground font-medium text-sm glow-blue hover:scale-105 transition-transform"
          >
            Open IDE
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
