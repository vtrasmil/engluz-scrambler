import React from "react";

export default function Navbar({timer, setTimer, setRoundEnd, fixed, muted, setMuted }) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="rounded-b shadow relative flex flex-wrap items-center justify-between px-2 py-3 main-nav mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between ">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="#pablo"
            >
              Scrambled
            </a>
            <div className="flex icons">
            {/* <img onClick={() => {
              if (timer) setTimer(false)
              else {
                console.log('set round end effect bar')
                setRoundEnd(Date.now() + 30 * 1000)
                setTimer(true)
              }
            }} src="./stopwatch.svg" className="cursor-pointer mx-2 w-[25px]" /> */}
              {/* <img onClick={() => setNavbarOpen(!navbarOpen)} src="./gear.svg" className="cursor-pointer mx-2 w-[25px]" /> */}
                <img onClick={() => setMuted(!muted)} src={`./${muted ? 'muted' :'volume'}.svg`} className={`cursor-pointer text-white w-[25px] mx-2 volume-icon ${muted ? 'muted' : ''}`} />
            </div>
            {/* <div
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="lg:hidden three col"
            >
              <div
                className={`hamburger ${navbarOpen ? "is-active" : ""}`}
                id="hamburger-7"
              >
                <span className="line"></span>
                <span className="line"></span>
                <span className="line"></span>
              </div>
            </div> */}
          </div>
          {/* <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <a
                  className=" py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">Share</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">Tweet</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="#pablo"
                >
                  <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">Pin</span>
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </nav>
    </>
  );
}
