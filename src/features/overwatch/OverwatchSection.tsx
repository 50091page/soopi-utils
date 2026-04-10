import { OverwatchMapTool } from "./OverwatchMapTool";
import { OverwatchTool } from "./OverwatchTool";

export function OverwatchSection() {
  return (
    <section className="shv0-overwatch-grid">
      <OverwatchTool />
      <OverwatchMapTool />
    </section>
  );
}
