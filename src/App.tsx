import { Github, RotateCcw } from "lucide-react";
import "./App.css";
import { KanbanBoard } from "./components/KanbanBoard";
import { ThemeToggle } from "./components/ThemeToggle";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import KanbanContextProvider from "./context/kanbanContext";
import { resetBoard } from "./data/taskStorage";

const FooterLink = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button
      variant="link"
      asChild
      className="scroll-m-20 text-xl font-semibold tracking-tight"
    >
      {children}
    </Button>
  );
};

export default function App() {
  const handleResetBoard = () => {
    if (window.confirm("¿Estás seguro que deseas resetear el tablero? Se eliminarán todas las tareas y columnas personalizadas.")) {
      resetBoard();
      window.location.reload();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <KanbanContextProvider>
        <div className="min-h-screen flex flex-col">
          <header className="flex justify-end w-full flex-row p-4 gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleResetBoard}
              title="Resetear tablero"
              className="relative"
            >
              <RotateCcw className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Resetear tablero</span>
            </Button>
            <ThemeToggle />
          </header>

          <main className="mx-4 flex flex-col gap-6">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Kanban Board
            </h1>
            <KanbanBoard />
            {/* <p className="leading-7 [&:not(:first-child)]:mt-6">
              Solo los reales no comeran torta 🎂.
            </p>  */}
          </main>
        </div>
      </KanbanContextProvider>
    </ThemeProvider>
  );
}
