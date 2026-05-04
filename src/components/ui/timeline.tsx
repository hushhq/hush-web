"use client";
import {
  useScroll,
  useTransform,
  motion,
  type MotionValue,
} from "motion/react";
import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  scrollContainer,
}: {
  data: TimelineEntry[];
  scrollContainer?: React.RefObject<HTMLElement | null>;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainer,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-background font-sans pb-[60vh] md:px-10"
      ref={containerRef}
    >
      <div ref={ref} className="relative mx-auto max-w-5xl pt-12 pb-20">
        {data.map((item, index) => (
          <TimelineRow
            key={index}
            item={item}
            scrollYProgress={scrollYProgress}
            refHeight={height}
          />
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-primary via-primary to-transparent from-[0%] via-[10%]"
          />
        </div>
      </div>
    </div>
  );
};

function TimelineRow({
  item,
  scrollYProgress,
  refHeight,
}: {
  item: TimelineEntry;
  scrollYProgress: MotionValue<number>;
  refHeight: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [threshold, setThreshold] = useState(0);

  useLayoutEffect(() => {
    if (!rowRef.current || refHeight <= 0) return;
    // Dot's static y-position relative to the timeline ref. Map to the same
    // 0..1 space the beam fills via scrollYProgress.
    const offset = rowRef.current.offsetTop;
    const ratio = offset / refHeight;
    setThreshold(ratio);
  }, [refHeight]);

  const litOpacity = useTransform(
    scrollYProgress,
    [Math.max(0, threshold - 0.02), threshold + 0.005],
    [0, 1]
  );

  return (
    <div
      ref={rowRef}
      className="flex justify-start pt-10 md:gap-10 md:pt-24"
    >
      <div className="sticky top-24 z-40 flex max-w-xs items-center self-start md:w-full lg:max-w-sm">
        <div className="group/dot absolute left-3 flex size-10 cursor-pointer items-center justify-center rounded-full bg-background md:left-3">
          {/* Base dot — neutral, with hover scale */}
          <div className="size-4 rounded-full border border-border bg-card transition-transform duration-200 group-hover/dot:scale-125" />
          {/* Lit overlay — opacity tied to scroll progress, centered via inset-0 m-auto */}
          <motion.div
            aria-hidden
            style={{ opacity: litOpacity }}
            className="pointer-events-none absolute inset-0 m-auto size-4 rounded-full bg-foreground shadow-[0_0_10px_var(--foreground)]"
          />
        </div>
        <h3 className="hidden text-xl font-bold text-muted-foreground md:block md:pl-20 md:text-5xl">
          {item.title}
        </h3>
      </div>

      <div className="relative w-full pl-20 pr-4 md:pl-4">
        <h3 className="mb-4 block text-left text-2xl font-bold text-muted-foreground md:hidden">
          {item.title}
        </h3>
        {item.content}
      </div>
    </div>
  );
}
