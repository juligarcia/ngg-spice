/// <reference types="vite-plugin-svgr/client" />

import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import Layout from "./components/Layout";
import IconSidebar from "./components/ui/IconSidebar/IconSidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";
import { HotkeysProvider } from "react-hotkeys-hook";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OsContextProvider } from "./components/context/OsContext";
import SimulationPanel from "./components/SimulationPanel/SimulationPanel";
import { Toaster } from "react-hot-toast";
import emojiData from "react-apple-emojis/src/data.json";
import { EmojiProvider } from "react-apple-emojis";
import ToggleLayout from "./components/ToggleLayout";
import FlexibleLayout from "./components/FlexibleLayout/FlexibleLayout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Decimation
);

function App() {
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
                    <Toaster
                      toastOptions={{
                        position: "top-right"
                      }}
                    />
                    <div className="h-full w-full flex bg-gradient-to-br from-primary to-secondary">
                      <div className="h-full flex flex-col items-center pt-8">
                        <IconSidebar
                          className="bg-background mt-4 mb-2 rounded-r-xl"
                          top={[
                            {
                              ariaLabel: "layout",
                              node: <ToggleLayout />
                            }
                          ]}
                          bottom={[
                            {
                              ariaLabel: "Theme toggle",
                              node: <ThemeToggle />
                            }
                          ]}
                        />
                      </div>
                      <div className="h-full w-full p-2">
                        <div className="h-full w-full overflow-hidden rounded-xl shadow-2xl flex">
                          <div className="flex py-2 pr-2 gap-2 grow min-w-0 bg-background">
                            <SimulationPanel />
                            <FlexibleLayout />
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
