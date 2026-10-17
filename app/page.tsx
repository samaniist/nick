import Hero from "@/components/hero";
import ScrollCue from "@/components/scroll-cue";
import StoryFooter from "@/components/story-footer";

export default function Home() {
  return <div id="top" className="bg-black">
    <ScrollCue />
    <Hero showClients={false}/>
    <StoryFooter/>
  </div>;
}
