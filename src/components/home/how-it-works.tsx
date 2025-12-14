const steps = [
  {
    title: "Sign in safely",
    copy: "Use Google or a guardian-approved login. No classroom chaos, just instant access.",
  },
  {
    title: "Pick your endangered buddy",
    copy: "Choose Koala, Hawksbill Turtle, Snow Leopard, Orangutan, or Black Rhino.",
  },
  {
    title: "Do the maths + story",
    copy: "Enter real numbers, tell us the risks, and imagine how climate change plays a role.",
  },
  {
    title: "Share the report",
    copy: "Print a gorgeous one-pager for your teacher and brag to your parents.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      id="how"
      className="mt-16 rounded-[32px] border border-slate-200 bg-white/80 p-8 shadow-sm"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        How it works
      </p>
      <h2 className="font-display text-3xl text-slate-900">
        Four friendly steps
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Step {index + 1}
            </p>
            <h3 className="mt-2 font-display text-xl text-slate-900">
              {step.title}
            </h3>
            <p className="text-sm text-slate-600">{step.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

