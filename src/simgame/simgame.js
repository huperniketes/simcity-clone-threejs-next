
"use client";

import { Game } from "~/scripts/game"
import { GameUI } from "~/scripts/ui";
import { SimObject } from '~/scripts/sim/simObject.js';

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

  const ui = new GameUI()

function
SimGame()
{

  return  (
    <>
    <div id="render-target"></div>
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
      <div id="ui-toolbar" className="container">
        <button id='button-select' className="ui-button selected" data-type="select" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSselect} />
        </button>
        <button id='button-bulldoze' className="ui-button" data-type="bulldoze" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSbulldozer} />
        </button>
        <button id='button-residential' className="ui-button" data-type="residential" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBShouse} />
        </button>
        <button id='button-commercial' className="ui-button" data-type="commercial" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSstore} />
        </button>
        <button id='button-industrial' className="ui-button" data-type="industrial" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSfactory} />
        </button>
        <button id='button-road' className="ui-button" data-type="road" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSroad} />
        </button>
        <button id='button-power-plant' className="ui-button" data-type="power-plant" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSpower} />
        </button>
        <button id='button-power-line' className="ui-button" data-type="power-line" onClick={ui.onToolSelected} >
          <Image className="toolbar-icon" height={20} width={20} src={nextBSpowerLine} />
        </button>
        <button id='button-pause' className="ui-button" onClick={ui.togglePause()} >
          <Image id='pause-button-icon' className="toolbar-icon" height={20} width={20} src={nextBSpause} />
        </button>
      </div>
      <div id="info-panel" className="container">
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
