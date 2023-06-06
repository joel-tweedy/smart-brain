import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'Signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    console.log('click');
      this.setState({imageUrl: this.state.input});

      const raw = JSON.stringify({
        "user_app_id": {
          "user_id": "joel-tweedy",
          "app_id": "test"
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": (this.state.input)
                    }
                }
            }
        ]
      });

      const requestOptions = {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Authorization': 'Key 5345d1897d614f0da2f06a964310d378'
          },
          body: raw
      };

      fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, requestOptions)
          .then(response => response.json())
          .then(result => this.displayFaceBox(this.calculateFaceLocation(result)))
          .catch(error => console.log('error', error));     
          console.log(fetch);
  }

  onRouteChange =(route) => {
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <ParticlesBg className="particles" num={200} type="cobweb" bg={true} />
        <Navigation onRouteChange={this.onRouteChange} />
        { this.state.route === 'Signin'
        ? <SignIn onRouteChange={this.onRouteChange} />
        : <div>
            <Logo />
            <Rank />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit} 
            />
            <FaceRecognition box= {this.state.box} imageUrl={this.state.imageUrl} />
         </div>
        }         
      </div>
    );
  }
}

export default App;