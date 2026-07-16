import { Motion } from "solid-motionone";
import { createSignal, onMount, type ParentProps } from "solid-js";

export default function MotionReveal(props: ParentProps<{ delay?: number; class?: string }>) {
  const [reduced, setReduced] = createSignal(false);

  onMount(() => setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches));

  return (
    <Motion.div
      class={props.class}
      initial={{ opacity: 0, transform: "translateY(20px)" }}
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
