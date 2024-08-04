import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import Layout from "./components/Layout";
import IconSidebar from "./components/ui/IconSidebar/IconSidebar";
import { AudioWaveform, ChevronLeft, PencilRuler, Wrench } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LocalStorage } from "./constants/localStorage";
import clsx from "clsx";
import { TooltipProvider } from "@/components/ui/tooltip";

function App() {
  const [minimizedSidebar, setMinimizedSidebar] = useLocalStorage(
    LocalStorage.Sidebar,
    false,
    (ls) => ls === "true"
  );

  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <TooltipProvider>
      <ThemeProvider>
        <Layout>
          <IconSidebar
            minimized={minimizedSidebar}
            top={[
              {
                ariaLabel: "editor",
                Icon: PencilRuler,
                onClick: () => {},
                title: "Editor"
              },
              {
                ariaLabel: "simulations",
                Icon: AudioWaveform,
                onClick: () => {},
                title: "Simulate"
              }
            ]}
            bottom={[
              {
                ariaLabel: "Theme toggle",
                node: <ThemeToggle minimized={minimizedSidebar} />,
                title: "Theme"
              },
              {
                ariaLabel: "Configuration",
                Icon: Wrench,
                onClick: () => {},
                title: "Configure"
              },
              {
                ariaLabel: "Minimize Sidebar",
                node: (
                  <ChevronLeft
                    className={clsx("transition-all duration-300 w-5 h-5", {
                      "rotate-180": minimizedSidebar,
                      "rotate-0": !minimizedSidebar
                    })}
                  />
                ),
                onClick: () => {
                  setMinimizedSidebar(!minimizedSidebar);
                }
              }
            ]}
          />
        </Layout>
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
