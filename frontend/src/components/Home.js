import React from "react";
import landingImage from "../assets/landing-image6.jpg";
import '../css/home.css';
import TextFieldSizes from "./text-box";
import { useEffect } from "react";

const Home = () => {

    useEffect(()=>{
        window.location.reload();
        window.stop()
    },[])

    return (
        <div className="container">
            <h1 className="nile"> Nile <br>
            </br>The Premier Delivery Management System</h1>
            <div className='search-container'>
                <TextFieldSizes></TextFieldSizes>
                <input type="button" value=" Go " id="theButton"></input>
            </div>
            <div className="image-container">
                <img src={landingImage} className='bg'></img>
            </div>

        </div>

    )
}

export default Home;