import React from 'react';
import Header from './Header';
import ContestList from './ContestList';
import Contest from './Contest';
import * as api from '../api';

const pushState = (obj, url) =>
  window.history.pushState(obj, '', url);

const onPopState = handler => {
  window.onpopstate = handler;
}

class App extends React.Component {
  static propTypes = {
    initialData: React.PropTypes.object.isRequired
  }
  state = this.props.initialData;

  componentDidMount(){
  	// ajax fetching is done here
  	// timers, listeners defined here
    onPopState((event) => {
      this.setState({
        currentContestId: (event.state || {}).currentContestId
      });
    });
  }

  componentWillUnmount() {
  	// clean timers, listeners
    onPopState(null);
  }

  fetchContest = (contestId) => {
    pushState(
      {currentContestId: contestId},
      `/contest/${contestId}`,
    );
    // lookup the contest
    // this.state.contests[contestId]
    api.fetchContest(contestId).then(contest => {
      this.setState({
        currentContestId: contest.id,
        // Cache contest information on the state
        contests: {
          ...this.state.contests,
          [contest.id]: contest
        }
      });
    });

  };

  fetchContestList = () => {
    pushState(
      {currentContestId: null},
      '/',
    );
    // lookup the contest
    // this.state.contests[contestId]
    api.fetchContestList().then(contests => {
      this.setState({
        currentContestId: null,
        // Cache contest information on the state
        contests
      });
    });
  };

  fetchNames = (nameIds) => {
    if (nameIds.length === 0){
      return;
    }
    api.fetchNames(nameIds).then(names =>{
      this.setState({
        names
      });
    });
  };

  // Get the current contest from our contests object saved on browser state from the initial server request.
  currentContest(){
    return this.state.contests[this.state.currentContestId];
  }

  pageHeader(){
    if(this.state.currentContestId) {
      return this.currentContest().contestName;
    }
    return 'Naming Contests';
  }

  lookupName = (nameId) => { 
    if(!this.state.names || !this.state.names[nameId]){
      return { 
        name:'...'
      };
    }
    return this.state.names[nameId];
  };

  currentContent(){
    if(this.state.currentContestId){
      return <Contest 
                fetchNames={this.fetchNames} 
                contestListClick={this.fetchContestList}
                lookupName={this.lookupName}
                {...this.currentContest()}/>;
    }else{
      return <ContestList 
              onContestClick={this.fetchContest}
              contests={this.state.contests} />;
    }
  }

  // Add a conditional if statement that returns an html object
  // Depending on certain condition {this.currentContent()}
  render(){
    return (
      <div className="App">
        <Header message={this.pageHeader()} />
        {this.currentContent()}
      </div>
    );
  }
}

export default App;