import React, { Component } from "react";
import { ReactComponent as TitleImg } from '../assets/minimaltitle.svg';
import { TimelineMax, Linear, CSSPlugin } from "gsap/all";

import "./Header.css";

//without this line, CSSPlugin and AttrPlugin may get dropped by your bundler...
const plugins = [ CSSPlugin ];

class Header extends Component {

  componentDidMount(){
    const repeat = new TimelineMax({repeat: -1})
    repeat.add(weatherAnimation())
  }

  render() {
    return (
     <div className="svg-container">
       <TitleImg className="svg-content"/>
     </div>
    )
  }
}

function weatherAnimation() {
  var tl = new TimelineMax()
  tl.fromTo("#rays", 8, {opacity: "0%"}, {opacity: "100%"});
  tl.from("#small-cloud", 7, {x: "3%"}, {x: "-2%", ease: Linear.easeInOut})
  tl.from("#big-cloud", 5, {x: "-3%"}, {x: ".5%", ease: Linear.easeInOut})

  tl.addLabel("sunny")
  
  tl.to("#small-cloud", 6, {x: "3%", ease: Linear.easeInOut}, "sunny")
  tl.to("#rays", 6, {autoAlpha: 0}, "sunny")
  tl.to("#big-cloud", 4, {x: "-3%", delay: .5, ease: Linear.easeInOut}, "sunny")
  return tl
}

export default Header;
