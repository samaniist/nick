import Hero from "@/components/hero";
import ScrollCue from "@/components/scroll-cue";
import StoryFooter from "@/components/story-footer";
import LiveBuild from "@/components/home/live-build";
import GrowthSimulator from "@/components/home/growth-simulator";

export default function Home() {
  return <div id="top" className="bg-black">
    <ScrollCue />
    <Hero showClients={false}/>
    <LiveBuild/>
    <GrowthSimulator/>
    <StoryFooter/>
  </div>;
}
