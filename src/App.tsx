/// <reference types="vite-plugin-svgr/client" />

import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import Layout from "./components/Layout";
import IconSidebar from "./components/ui/IconSidebar/IconSidebar";
import { AudioWaveform, Wrench } from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LocalStorage } from "./constants/localStorage";
import { TooltipProvider } from "@/components/ui/tooltip";
import Editor from "@/components/Editor/Editor";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OsContextProvider } from "./components/context/OsContext";
import SimulationPanel from "./components/SimulationPanel/SimulationPanel";
import { Toaster } from "react-hot-toast";
import emojiData from "react-apple-emojis/src/data.json";
import { EmojiProvider } from "react-apple-emojis";

function App() {
  const [openSimulationPanel, setOpenSimulationPanel] = useLocalStorage(
    LocalStorage.SimulationPanel,
    false,
    (ls) => ls === "true"
  );

  const queryClient = new QueryClient();

  return (
    <EmojiProvider data={emojiData}>
      <QueryClientProvider client={queryClient}>
        <OsContextProvider>
          <HotkeysProvider>
            <ReactFlowProvider>
              <TooltipProvider>
                <ThemeProvider>
                  <Layout>
                    <Toaster />
                    <div className="h-full w-full flex bg-gradient-to-br from-primary to-secondary">
                      <div className="h-full flex flex-col items-center pt-8">
                        <IconSidebar
                          className="bg-background mt-4 mb-2 rounded-r-xl"
                          top={[
                            {
                              ariaLabel: "simulations",
                              Icon: AudioWaveform,
                              onClick: () => {
                                setOpenSimulationPanel(!openSimulationPanel);
                              },
                              title: "Simulate"
                            }
                          ]}
                          bottom={[
                            {
                              ariaLabel: "Project Configuration",
                              Icon: Wrench,
                              onClick: () => {},
                              title: "Project"
                            },
                            {
                              ariaLabel: "Theme toggle",
                              node: <ThemeToggle />,
                              title: "Theme"
                            }
                          ]}
                        />
                      </div>
                      <div className="h-full w-full p-2">
                        <div className="h-full w-full overflow-hidden rounded-xl shadow-2xl flex">
                          <div className="flex p-2 gap-2 grow min-w-0 bg-background">
                            <SimulationPanel open={openSimulationPanel} />
                            <div className="bg-card w-full h-full rounded-lg border-2 border-accent flex flex-col justify-center items-center overflow-hidden">
                              <Editor />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Layout>
                </ThemeProvider>
              </TooltipProvider>
            </ReactFlowProvider>
          </HotkeysProvider>
        </OsContextProvider>
      </QueryClientProvider>
    </EmojiProvider>
  );
}

export default App;
