import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
//import * as actions from '../actions';
import { fetchUser } from '../store/actions/authActions'
import Header from './layout/Header'
import Landing from './layout/Landing'
import Dashboard from './layout/Dashboard'

class App extends Component {
  componentDidMount () {
    this.props.fetchUser()
  }
  render () {
    return (
      <div>
        <BrowserRouter>
          <div>
            <Route exact path='/' component={Dashboard} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: () => dispatch(fetchUser())
  }
}

export default connect(null, mapDispatchToProps)(App)
