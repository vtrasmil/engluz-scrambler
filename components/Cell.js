export function Cell({
  animationDelay,
  isHighContrast,
  shouldReveal,
  isFilled,
  letter,
}) {
  const classes =
    "md:w-14 md:h-14 bg-white w-10 h-10 border-solid border-2 flex items-center justify-center mx-0 md:mx-0.5 lg:text-4xl md:text-2xl  text-2xl font-bold rounded dark:text-white";

  //   {
  //     'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
  //       !status,
  //     'border-black dark:border-slate-100': value && !status,
  //     'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
  //       status === 'absent',
  //     'correct shadowed bg-green-500 text-white border-green-500':
  //       status === 'correct',
  //     'present shadowed bg-yellow-500 text-white border-yellow-500':
  //       status === 'present',
  //     'cell-fill-animation': isFilled,
  //     'cell-reveal': shouldReveal,
  //   }
  // )

  return (
    <div className={classes} style={{ animationDelay }}>
      <div className="letter-container" style={{ animationDelay }}>
        <span className={`${shouldReveal ? "" : "in"}visible text-black`}>
          {letter}
        </span>
      </div>
    </div>
  );
}
