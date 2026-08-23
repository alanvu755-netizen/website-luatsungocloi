interface CommitmentProps {
  data: {
    heading: string;
    content: string;
  } | null;
}

export default function CommitmentSection({ data }: CommitmentProps) {
  if (!data) return null;

  return (
    <section className="py-4 mt-6">
      
      {/* Quote Card Box */}
      <div className="relative bg-surface-soft border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        
        {/* Large Decorative Double Quote Marks */}
        <span className="font-serif text-5xl sm:text-6xl text-navy font-bold leading-none select-none absolute top-3 left-4 opacity-80">
          “
        </span>

        <div className="pt-4 px-3 sm:px-6 text-center sm:text-left">
          {/* Bold Motto Title */}
          <h3 className="font-serif font-bold text-navy text-base sm:text-lg tracking-wide mb-2">
            {data.heading}
          </h3>

          {/* Italic Commitment Statement */}
          <p className="font-sans italic text-slate-700 text-sm sm:text-base leading-relaxed">
            {data.content}
          </p>
        </div>

        <span className="font-serif text-5xl sm:text-6xl text-navy font-bold leading-none select-none absolute bottom-1 right-4 opacity-80">
          ”
        </span>

      </div>

    </section>
  );
}
