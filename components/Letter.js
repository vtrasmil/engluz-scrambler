import { useState, useEffect } from "react";
import { Cell } from "./Cell";
export const Letter = (props) => {
  const vis = props.visibility ?? true;
  return (
    <span onClick={props.onClick} className={`mx-1 mb-1  inline-block`}>
      <span className={`uppercase`}>
        <Cell letter={props.letter} shouldReveal={vis} />
      </span>
    </span>
  );
};
