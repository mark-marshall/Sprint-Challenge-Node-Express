import React, { Component } from 'react';
import axios from 'axios';

const projectUrl = 'http://localhost:4000/api/projects';

class App extends Component {
  state = {
    projects: [],
    error: '',
  };

  componentDidMount() {
    axios
      .get(projectUrl)
      .then(projects => {
        this.setProjects(projects.data);
      })
      .catch(error => {
        this.setError(error.message);
      });
  }

  setProjects = projects => {
    this.setState({
      projects,
    })
  }

  setError = error => {
    this.setState({
      error,
    })
  }

  render() {
    if (this.state.error) {
      return <div>We got an error over here: {this.state.error};</div>;
    } else {
      return (
        <div>
          Hello World
          <ul>
            {this.state.projects.map(project => (
              <li key={project.id}>
                <h5>Name: {project.name}</h5>
                <p>Description: {project.description}</p>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
}

export default App;
