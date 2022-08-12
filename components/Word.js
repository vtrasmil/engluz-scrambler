export const Word = (props) => {
  const vis = props.visibility || props.reveal;
  const word = vis
    ? props.word
    : props.word
        .split("")
        .map((y) => "_")
        .join("");
  const light = props.reveal;
  return (
    <div
      className={`${light ? "text-slate-400" : ""} grow-0 self-start length-${
        word.length
      } bg-white border-2 rounded-lg mr-2 py-1 px-2 mb-2 tracking-widest ${
        vis ? "" : "text-slate-200"
      }`}
    >
      {word.split("").map((letter, index) => {
        return (
          <span
            key={`l${index}`}
            className={`text-bold font-bold text-lg uppercase`}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};
