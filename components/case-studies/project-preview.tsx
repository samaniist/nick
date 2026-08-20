import type { ProjectPreview as ProjectPreviewName } from "@/components/case-studies/case-study-data";
import LiveSiteImage from "@/components/case-studies/live-site-image";

const screenshots: Record<
  ProjectPreviewName,
  { src: string; alt: string; domain: string; width: number }
> = {
  atlantis: {
    src: "/case-studies/atlantis-scroll.png",
    alt: "Atlantis Wellness Centers website homepage",
    domain: "atlantiswellnesscenters.com",
    width: 1440,
  },
  veenendaal: {
    src: "/case-studies/veenendaal-scroll.png",
    alt: "Mondzorgpraktijk Veenendaal website homepage",
    domain: "mondzorgpraktijkveenendaal.nl",
    width: 1440,
  },
  haveneiland: {
    src: "/case-studies/haveneiland-scroll.png",
    alt: "Mondzorg Haveneiland website homepage",
    domain: "mondzorghaveneiland.nl",
    width: 1380,
  },
  onelogy: {
    src: "/case-studies/onelogy-scroll.png",
    alt: "Onelogy website homepage",
    domain: "onelogy.com",
    width: 1440,
  },
  sepehr: {
    src: "/case-studies/sepehr-scroll.png",
    alt: "The Sepehr website homepage",
    domain: "thesepehr.org",
    width: 1440,
  },
};

export default function ProjectPreview({ preview, index }: { preview: ProjectPreviewName; index: number }) {
  const screenshot = screenshots[preview];

  return (
    <div className="relative h-full bg-[#11120f]">
      <div className="flex h-10 items-center gap-2 border-b border-white/10 bg-[#11120f] px-4">
        <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#b9ff2b]" />
        <span className="ml-2 truncate font-mono text-[8px] tracking-[0.12em] text-white/40">
          {screenshot.domain}
        </span>
      </div>
      <div className="relative h-[calc(100%-2.5rem)] overflow-hidden bg-zinc-900">
        <LiveSiteImage
          src={screenshot.src}
          alt={screenshot.alt}
          width={screenshot.width}
          height={3600}
          sizes="(max-width: 1023px) 100vw, 58vw"
          delay={index * 0.12}
        />
      </div>
    </div>
  );
}
