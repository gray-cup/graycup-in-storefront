const REPEAT_COUNT = 6;

export function Marquee({ text }: { text: string }) {
  const items = Array.from({ length: REPEAT_COUNT });

  return (
    <div className="w-full overflow-hidden bg-black py-5 rounded-2xl">
      <div className="flex w-max animate-marquee-ltr">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0">
            {items.map((_, i) => (
              <span
                key={i}
                className="mx-6 text-4xl md:text-6xl font-bold uppercase tracking-tight text-white whitespace-nowrap"
              >
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
