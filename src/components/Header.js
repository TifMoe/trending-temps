import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="heading">
        <Title />
        <div className="sub-title">
          Comparing historical temperature variance between major cities around
          the world
        </div>
      </div>
    );
  }
}

const Title = () => {
  return (
    <div className="title">
      <div className="bold">Trending </div>
      <div className="thin">Temperatures</div>
    </div>
  );
};

export default Header;
