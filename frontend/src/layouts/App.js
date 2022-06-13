import React, { Component } from 'react';
import '../styles/App.css';
import '../styles/MeetingCU.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';
import Page from './Page';
import Footer from './Footer';
import { ToastContainer } from "react-toastify";
import '../styles/Mobile.css'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app">


          {<Navigation />}

          <main>

            <section className="page">
              <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              {<Page />}
            </section>
          </main>
          <footer>{<Footer />}</footer>
        </div>
      </Router>
    );
  }
}

export default App;