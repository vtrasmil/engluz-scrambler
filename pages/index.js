import Head from "next/head";
import styles from "../styles/Home.module.css";
import dictionary from "../dictionary.json";
import wordlist from "../wordlist.json";
import { Letter } from "../components/Letter";
import { Word } from "../components/Word";
import { Grid } from "../components/Grid";
import useKeypress from "./test";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import Navbar from "../components/Navbar";
import { Timer } from '../components/Timer'
import { Howl, Howler } from "howler";

export default function Home() {

  const roundTime = 10;
  const [muted, setMuted] = useState(false)
  const [word, setWord] = useState(undefined);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState(new Array(6));
  const [guess, setGuess] = useState([]);
  const [lastScore, setLastScore] = useState(0);
  const [roundEnd, setRoundEnd] = useState(undefined);
  const [gameOver, setGameOver] = useState(undefined);
  const [possibleWords, setPossibleWords] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [round, setRound] = useState(1);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [timer, setTimer] = useState(false)
  const [restarting, setRestarting] = useState(false)

  var letterSound = new Howl({
    src: ["./sounds/letter.wav"],
    volume: 0.5,
  });
  var successSound = new Howl({
    src: ["./sounds/confirm.wav"],
  });
  var failSound = new Howl({
    src: ["./sounds/cancel.wav"],
  });

  useEffect(() => {
    function onKeyup(e) {
      console.log(`KEYUP ${e.key}`);
      const letter = e.key.toLowerCase();
      if (letter.toLowerCase() === "enter") {
        return guessWord();
      }

      if (letter.toLowerCase() === " ") return shuffleBoard();
      if (letter.toLowerCase() === "backspace") return removeLetter();

      const avail = board.filter((x) => x.letter === letter && !x.guessed);
      if (avail.length) {
        selectLetter(avail[0]);
      }
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [board]);

  const reselectWord = () => {
    const lastWord = guesses[guesses.length - 1];
    console.log(`Last word ${lastWord}`);
    if (lastWord) {
      lastWord.split("").forEach((letter) => {
        const avail = board.filter((x) => {
          return x.letter === letter;
        });
        if (avail.length) {
          selectLetter(avail[0]);
        }
      });
    }
  }

  const RoundDialog = () => {
    return (
      <Dialog
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isDialogOpen}
        onClose={() => restartGame()}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative rounded lg:w-2/3 xl:w-1/2 sm:w-full mx-auto p-8">
            <Dialog.Overlay
              style={{ zIndex: -1 }}
              className="fixed inset-0 bg-black opacity-30"
            />
            <button
              className="text-black text-3xl font-bold uppercase absolute"
              style={{
                top: "45px",
                right: "55px",
              }}
              onClick={() => setDialogOpen(false)}
            >
              &times;
            </button>
            <div className={"z-10 w-full py-20 px-10 bg-white  items-center"}>
              {gameOver && (
                <>
                  <p className="font-bold uppercase text-xl my-2 text-center">
                    Game Over!
                  </p>
                  <p className="text-slate-400 text-sm my-2 mb-4 text-center">
                    You did not solve the full word! Better luck next time!
                  </p>
                </>
              )}
              {!gameOver && (
                <>
                  <p className="font-bold uppercase text-xl my-2 text-center">
                    Well Done!
                  </p>
                  <p className="text-slate-400 text-sm my-2 mb-4 text-center">
                    You've qualified to proceed to the next round!
                  </p>
                </>
              )}
              <div className="w-[150px] mt-2 mx-auto">
                <p className={"flex flex-row"}>
                  <b className="w-1/2">Round:</b>
                  <span className="w-1/2 text-right"> {round}</span>
                </p>
                <p className={"flex flex-row"}>
                  <b className="w-1/2">Total:</b>
                  <span className="w-1/2 text-right"> {score}</span>
                </p>
                <p className={"flex flex-row"}>
                  <b className="w-1/2">Level:</b>
                  <span className="w-1/2 text-right"> {level}</span>
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  const setupWord = () => {
    const word = selectWord();
    console.log(`Word is ${word}`);
    if (!word) {
      console.error("Unable to fetch word");
      return;
    }
    setWord(word);
    setGuess([]);
    console.log("MAKNING HASH");
    setBoard(
      scrambleWord(word)
        .split("")
        .map((letter, index) => {
          return {
            letter,
            index,
            guessed: false,
            hash: Math.floor(Math.random() * 10000),
          };
        })
    );
    console.log(word);
    const solves = solveWord(word);
    setPossibleWords(
      solves
        .map((word, index) => {
          return {
            word,
            index,
            solved: false,
          };
        })
        .sort((a, b) => a.word.length - b.word.length)
    );
  }

  // First run
  useEffect(() => {
    setDialogOpen(false);
    setWord(undefined);
    setScore(0);
    setRound(1);
    setGameOver(false);
    setGuesses([]);
    console.log('set round end effect')
    console.log(Date.now() + roundTime * 1000)
    
    setupWord();
    setRoundEnd(Date.now() + roundTime * 1000);
  }, []);

  const shuffle = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  const shuffleBoard = () => {
    const array = board;
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    array.forEach((x, i) => (x.index = i));
    setBoard([...array]);
  }

  const guessWord = () => {
    const word = guess.map((x) => x.letter).join("");
    if (!word.length) {
      return reselectWord();
    }
    if (word.length < 3) return toast.error("Too short");
    if (word.length > 6) return toast.error("Too long");
    console.log(`Guess ${word}`);
    if (dictionary[word.substr(0, 1)].includes(word)) {
      if (guesses.filter((w) => w === word).length > 0) {
        !muted && failSound.play()
        for (var i = 0; i < board.length; ++i) {
          board[i].guessed = false;
        }
        setGuess([]);
        setBoard([...board]);
        return toast.error(`Already Guessed!`);
      }
      console.log(`Correct ${word}`);
      setGuesses([...guesses, word]);
      setPossibleWords(
        possibleWords.map((pos) => {
          if (pos.word === word) pos.solved = true;
          return pos;
        })
      );

      const points = 25 * word.length;
      setScore(score + points);
      const phrases = ["Nice", "Great", "Wow", "Excellent", "Splendid"];
      const adjective = phrases[Math.floor(Math.random() * phrases.length)];

      if (
        guesses.filter((w) => w.length === 6).length == 0 &&
        word.length === 6
      ) {
        toast.success("Next round unlocked!");
      }

      toast.success(`${adjective}! +${points} points!`);
      !muted && successSound.play()
    } else {
      toast.error(`Not found!`);
      !muted && failSound.play()
    }
    for (var i = 0; i < board.length; ++i) {
      board[i].guessed = false;
    }
    setGuess([]);
    setBoard([...board]);
  }

  const selectLetter = (letter) => {
    console.log(board);
    if (letter.guessed) return;
    letterSound.play();
    letter.guessed = true;
    guess.push({
      _index: guess.length - 1,
      ...letter,
    });
    setGuess([...guess]);
    setBoard([...board]);
  }

  const getLetter = (letter) => {
    return board.filter((b) => b.hash == letter.hash)[0];
  }

  const endRound = (timerInit) => {
     possibleWords.forEach((x) => {
      if (!x.solved) x.reveal = true;
    });
    setPossibleWords([...possibleWords]);
    setLastScore(score);

    setGameOver(guesses.filter((w) => w.length == 6).length === 0);
    setDialogOpen(true);
    setRestarting(true);
    return;
  }

  const restartGame = () => {
    setRestarting(false);
    if (gameOver) {
      setRound(1);
      setScore(0);
    } else {
      setRound(round + 1);
    }
    setupWord();
    console.log('set round end restart ')
    setRoundEnd(Date.now() + roundTime * 1000);
  }

  const removeLetter = () => {
    if (!guess.length) return;
    const letter = guess.pop();
    const boardLetter = getLetter(letter);
    console.log(boardLetter);
    boardLetter.guessed = false;
    setGuess([...guess]);
    setBoard([...board]);
  }

  const unselectLetter = (letter) => {
    if (!letter.guessed) return;
    letter.guessed = false;
    guess[letter._index] = undefined;
    board[letter.index] = letter;
    setGuess([...guess]);
    setBoard([...board]);
  }

  const scrambleWord = (word) => {
    let scrambled = shuffle(word.split(""));
    if (scrambled.join("") === word) return scrambleWord(word);
    return scrambled.join("");
  }

  const selectWord = () => {
    const index = Math.round(Math.random() * wordlist.length);
    return wordlist[index];
  }

  const solveWord = (word) => {
    var letters = word.toLowerCase().split("");
    var string = "";
    const solves = {};
    for (let a = 0; a < 6; ++a) {
      string += letters[a];
      for (let b = 0; b < 6; ++b) {
        if (a == b) continue;
        string += letters[b];
        for (let c = 0; c < 6; ++c) {
          if (c == b || c == a) continue;
          string += letters[c];
          if (dictionary[string.substring(0, 1)].includes(string))
            solves[string] = 1;

          for (let d = 0; d < 6; ++d) {
            if (d == a || d == b || d == c) continue;
            string += letters[d];
            if (dictionary[string.substring(0, 1)].includes(string))
              solves[string] = 1;

            for (let e = 0; e < 6; ++e) {
              if (e == a || e == b || e == c || e == d) continue;
              string += letters[e];
              if (dictionary[string.substring(0, 1)].includes(string))
                solves[string] = 1;

              for (let f = 0; f < 6; ++f) {
                if (f == a || f == b || f == c || f == d || f == e) continue;
                string += letters[f];
                if (dictionary[string.substring(0, 1)].includes(string))
                  solves[string] = 1;

                string = string.substring(0, string.length - 1);
              }
              string = string.substring(0, string.length - 1);
            }
            string = string.substring(0, string.length - 1);
          }
          string = string.substring(0, string.length - 1);
        }
        string = string.substring(0, string.length - 1);
      }
      string = string.substring(0, string.length - 1);
    }
    return Object.keys(solves);
  }

  return (
    <>
      <Navbar setRoundEnd={setRoundEnd}  timer={timer} setTimer={setTimer} muted={muted} setMuted={setMuted} />
      <div className={styles.container}>
        <Head>
          <title>Word Scrambler</title>
          <meta
            name="description"
            content="Word Scramble - A classic word game"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main>
          <div className={"mt-10"}>
            {" "}
            <div className={""}>
              <div
                className={
                  "flex overflow-auto grow-0 flex-wrap flex-col max-w-xl lg:h-[30vh] h-[40vh] word-bank m-auto"
                }
              >
                {
                  //const buckets = Math.ceil(possibleWords.length / 6);
                  possibleWords.map((w) => {
                    return (
                      <Word
                        key={w.word}
                        reveal={w.reveal ?? false}
                        visibility={w.solved}
                        word={w.word}
                      />
                    );
                  })
                }
              </div>
            </div>
          </div>
          <div className={"flex justify-center"}>
          <div className="flex pt-1 justify-center mt-5">
              {guess.map((pos, index) => {
                return <Letter {...pos} size={"sm"} key={index} />;
              })}
          </div>
          </div>
          <div className="flex justify-center">
            <div className={"mt-2 overflow-auto"}>
              <div className="flex justify-center">
                {board.map((pos, index) => {
                  return (
                    <Letter
                      onClick={() => selectLetter(pos)}
                      {...pos}
                      visibility={!pos.guessed}
                      size={"sm"}
                      key={index}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          {!restarting && <div className="flex justify-center">
            <div className={"flex mt-10"}>
            <button
                className={
                  "mx-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out secondary-button "
                }
                onClick={removeLetter}
              >
                BACKSPACE
              </button>
              <button
                className={
                  "mx-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out secondary-button "
                }
                onClick={shuffleBoard}
              >
                SHUFFLE
              </button>
              <button
                className={
                  "mx-4 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out guess-button"
                }
                onClick={guessWord}
              >
                GUESS!
              </button>
            </div>
          </div> }
          <div className="flex justify-center">
            {!restarting && <div className={"flex my-10"}>
              {guesses.filter((w) => w.length == 6).length >= 1 && (
                <button
                  className={
                    "mx-4 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out primary-button"
                  }
                  onClick={endRound}
                >
                  NEXT ROUND
                </button>
              )}
              {guesses.filter((w) => w.length == 6).length == 0 && (
                <button
                  className={
                    "mx-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out primary-button"
                  }
                  onClick={endRound}
                >
                  END ROUND
                </button>
              )}
            </div> }
            {restarting && <div className="mb-4 mt-4 flex justify-center">
                {gameOver && (
                  <>
                    <button
                      className={`px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out text-black border-1 border-black mx-5 font-bold uppercase `}
                      onClick={() => restartGame()}
                    >
                      Restart
                    </button>{" "}
                  </>
                )}
                {!gameOver && (
                  <>
                    <button
                      className={`px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out text-black border-1 border-black mx-5 font-bold uppercase `}
                      onClick={() => restartGame()}
                    >
                      {"Start Next Round"}
                    </button>{" "}
                  </>
                )}
              </div> }
          </div>
          <div className={"mb-10"}>
            <p
              className={
                " font-bold text-md text-center uppercase right-1 top-1"
              }
            >
              <b>Score:</b> {score}
            </p>
            <p
              className={
                " font-bold text-md text-center uppercase left-1 top-1"
              }
            >
              <b>Level:</b> {round}
            </p>
            { timer && <p
              className={
                " font-bold text-md text-center uppercase left-1 top-1"
              }
            >
              <b>Time:&nbsp;</b>
              <Timer expiryTimestamp={roundEnd}  onExpire={endRound}  />
            </p> }
          </div>
        </main>

        <footer className={`${styles.footer} justify-center`}>
          <p className={"flex lowercase font-xs text-xs"}>
            <span>Scrambled - Made by </span>{' '}
            <a
              href="https://nickpiscitelli.com"
              target="_blank"
              rel="noopener noreferrer"
            >
            {' '}
              <span className={"ml-1 text-slate-500"}>Nick Piscitelli</span>
            </a>
          </p>
        </footer>
      </div>
      <Toaster />
      <RoundDialog />
    </>
  );
}
