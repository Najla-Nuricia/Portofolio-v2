import { Motion } from "solid-motionone";
import { createSignal, onCleanup, onMount, type ParentProps } from "solid-js";

export default function MotionReveal(props: ParentProps<{ delay?: number; class?: string }>) {
  const [reduced, setReduced] = createSignal(
    typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  onMount(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const updateReduced = () => setReduced(motion.matches);
    motion.addEventListener("change", updateReduced);
    updateReduced();
    onCleanup(() => motion.removeEventListener("change", updateReduced));
  });

  return (
    <Motion.div
      class={props.class}
      initial={reduced() ? false : { opacity: 0, transform: "translateY(16px)" }}
      inView={{ opacity: 1, transform: "translateY(0)" }}
      inViewOptions={{ amount: 0.2, once: true }}
      transition={{
        duration: reduced() ? 0 : 0.5,
        delay: reduced() ? 0 : (props.delay ?? 0),
        easing: [0.22, 1, 0.36, 1],
      }}
    >
      {props.children}
    </Motion.div>
  );
}
