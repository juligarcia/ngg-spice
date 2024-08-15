/// <reference types="vite-plugin-svgr/client" />

import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import Layout from "./components/Layout";
import IconSidebar from "./components/ui/IconSidebar/IconSidebar";
import {
  AudioWaveform,
  ChevronLeft,
  CircuitBoard,
  PencilRuler,
  Wrench
} from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { LocalStorage } from "./constants/localStorage";
import clsx from "clsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import Editor from "@/components/Editor";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OsContextProvider } from "./components/context/OsContext";
import { SpiceContextProvider } from "./components/context/SpiceContext";

function App() {
  const [minimizedSidebar, setMinimizedSidebar] = useLocalStorage(
    LocalStorage.Sidebar,
    false,
    (ls) => ls === "true"
  );

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SpiceContextProvider>
        <OsContextProvider>
          <HotkeysProvider>
            <ReactFlowProvider>
              <TooltipProvider>
                <ThemeProvider>
                  <Layout>
                    <div className="h-full w-full flex bg-gradient-to-br from-primary to-secondary">
                      <div className="h-full flex flex-col items-center pt-8">
                        <IconSidebar
                          className="bg-background mt-4 mb-2 rounded-r-xl"
                          top={[
                            {
                              ariaLabel: "Next Generation Graphic Spice Logo",
                              node: <img className="w-6 h-6" src="logo.png" />
                            },
                            {
                              ariaLabel: "Schematic 1",
                              Icon: CircuitBoard,
                              onClick: () => {},
                              title: "Schematic 1"
                            },
                            {
                              ariaLabel: "Schematic 2",
                              Icon: CircuitBoard,
                              onClick: () => {},
                              title: "Schematic 2"
                            },
                            {
                              ariaLabel: "Schematic 3",
                              Icon: CircuitBoard,
                              onClick: () => {},
                              title: "Schematic 3"
                            }
                          ]}
                          bottom={[
                            {
                              ariaLabel: "Theme toggle",
                              node: <ThemeToggle />,
                              title: "Theme"
                            }
                          ]}
                        />
                      </div>
                      <div className="h-full w-full p-2">
                        <div className="h-full w-full overflow-hidden rounded-xl shadow-2xl border flex">
                          <IconSidebar
                            className="bg-background"
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
                                ariaLabel: "Configuration",
                                Icon: Wrench,
                                onClick: () => {},
                                title: "Configure"
                              },
                              {
                                ariaLabel: "Minimize Sidebar",
                                node: (
                                  <ChevronLeft
                                    className={clsx(
                                      "transition-all duration-300 w-5 h-5",
                                      {
                                        "rotate-180": minimizedSidebar,
                                        "rotate-0": !minimizedSidebar
                                      }
                                    )}
                                  />
                                ),
                                onClick: () => {
                                  setMinimizedSidebar(!minimizedSidebar);
                                }
                              }
                            ]}
                          />
                          <div className="pr-2 py-2 grow min-w-0 bg-background">
                            <div className="bg-card w-full h-full rounded-lg border flex flex-col justify-center items-center overflow-hidden">
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
      </SpiceContextProvider>
    </QueryClientProvider>
  );
}

export default App;
