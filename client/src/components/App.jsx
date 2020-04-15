import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
//import * as actions from '../actions';
import { fetchUser } from "../store/actions/authActions";
import Dashboard from "./layout/Dashboard";
import ImageGalleryContainer from "./image-gallery/ImageGalleryContainer";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Dashboard} />
            <Route path="/userImages" component={ImageGalleryContainer} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: () => dispatch(fetchUser())
  };
};

export default connect(null, mapDispatchToProps)(App);
