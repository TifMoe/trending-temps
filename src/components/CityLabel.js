import React, { Component } from 'react'
import './CityLabel.css'

class CityLabel extends Component {

    updateCity(e) {
        console.log(e)
        this.props.updateCities(e)
    }

    makeButtons() {
        let cities = this.props.cities
        let buttons = []
        cities.forEach((c, i) => {
            let selected = i === this.props.selectedCity
            buttons.push(
                <button 
                    className="city"
                    key={c} 
                    style={{ 
                        backgroundColor:  selected ? "transparent" : "lightgrey",
                        color: "black",
                        fontSize: selected ? "30px" : "15px",
                    }}
                    disabled={selected}
                    onClick={() => this.updateCity(i)}>
                    {c}
                </button>
            )
        });
        console.log(buttons)
        return buttons
    }

    render() {
        return(
            <div>{this.makeButtons()}</div>
        )
    }
}

export default CityLabel