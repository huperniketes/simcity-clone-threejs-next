
"use client";

import { Game } from "~/scripts/game"
import { GameUI } from "~/scripts/ui";
import "../public/main.css";

import {
  useEffect,
  useRef,
  useState
} from "react";

import Image from "next/image"
import nextBSperson from "../public/icons/person.png";
import nextBSselect from "../public/icons/select-color.png";
import nextBSbulldozer from "../public/icons/bulldozer-color.png";
import nextBShouse from "../public/icons/house-color.png";
import nextBSstore from "../public/icons/store-color.png";
import nextBSfactory from "../public/icons/factory-color.png";
import nextBSroad from "../public/icons/road-color.png";
import nextBSpower from "../public/icons/power-color.png";
import nextBSpowerLine from "../public/icons/power-line-color.png";
import nextBSpause from "../public/icons/pause-color.png";

function
selectMenuItem(event)
{
  
}

/**
 * Builds a menu item component based on the parameters
 * @param {string} type
 * @param {import("next/dist/shared/lib/get-img-props").StaticImport} imgSource
 * @param {boolean} isSelected
 * @param {import("react").MouseEventHandler<HTMLButtonElement>} aParentFunction
 * @returns {JSX.Element}
 */
function
MenuItem(type, imgSource, isSelected, aParentFunction)
{

  function
  itemSelected()
  {
  }

  return  (
    <>
    <button id={`button-${type}`} className={"ui-button" + (isSelected ? " selected" : "")} data-type={type} onClick={e => aParentFunction(e)} >
      <Image className="toolbar-icon" height={32} width={32} src={imgSource} alt={type} />
    </button>
    </>
  );
}

const
gameMenuItems = [
  { type: "select",      imgSource: nextBSselect    },
  { type: "bulldoze",    imgSource: nextBSbulldozer },
  { type: "residential", imgSource: nextBShouse     },
  { type: "commercial",  imgSource: nextBSstore     },
  { type: "industrial",  imgSource: nextBSfactory   },
  { type: "road",        imgSource: nextBSroad      },
  { type: "power-plant", imgSource: nextBSpower     },
  { type: "power-line",  imgSource: nextBSpowerLine }
];

/**
 * @param {{clickHandler: (s: string) => (void)}} props
 */
function
ToolMenu({clickHandler})
{
  const [selectedTool, setSelectedTool] = useState("select");

  /**
   * @param {MouseEvent} e
   */
  function
  tellMe(e)
  {

    e.preventDefault();
    setSelectedTool(e.target.dataset.type);
    clickHandler && clickHandler(selectedTool);
  }

  return  (
    <>
      <ul>
      {gameMenuItems.map(i => (
        <li key={i.type} >
          {MenuItem(i.type, i.imgSource, i.type === selectedTool, tellMe)}
        </li>
      ))}
      </ul>
    </>
  );
}

function
SimGame()
{
  const [game, setGame] = useState(/** @param {Game} */ null);
  const renderRef = useRef(/** @type{HTMLDivElement} */null);

  useEffect(() => {
    let ui = new GameUI(renderRef);

    setGame(new Game(null, {ui: ui}, renderRef)); // replaced document.getElementById('render-target')
  }, []);

  function
  togglePause()
  {
  }

  return  (
    <>
    <div id="render-target" data-width="1200" data-height="1200" ref={renderRef}></div>
    <div id="loading" className="text-overlay">
      <div>
        LOADING...
      </div>
    </div>
    <div id="paused-text" className="text-overlay" style={{ visibility: "hidden" }} >
      <div>
        PAUSED
      </div>
    </div>
    <div id="ui">
      <div id="title-bar">
        <div className="title-bar-left-items title-bar-items">
          $1000
        </div>
        <div className="title-bar-center-items title-bar-items">
          <span id="city-name">My City</span>
          <span>&nbsp;-&nbsp;</span>
          <span id="sim-time">1/1/2023</span>
        </div>
        <div className="title-bar-right-items title-bar-items">
          <Image id="population-icon" height={20} width={20} src={nextBSperson} />
          <span id="population-counter">0</span>
        </div>
      </div>
      <div id="ui-toolbar" className="container" style={{ maxWidth: "64px" }} >
        <ToolMenu clickHandler={/** @type {Game} */(game)?.toolSelected.bind(game)} />
        <button id='button-pause' className="ui-button" onClick={togglePause} >
          <Image id='pause-button-icon' className="toolbar-icon" height={20} width={20} src={nextBSpause} />
        </button>
      </div>
      <div id="info-panel" className="container" >
      </div>
      <div id="instructions">
        <p>INTERACT - Left Mouse</p>
        <p>ROTATE - Right Mouse</p>
        <p>PAN - Control + Right Mouse</p>
        <p>ZOOM - Scroll</p>
      </div>
      <div id="version">
        v0.3.0
      </div>
    </div>
    </>
  );
}

export { SimGame };
