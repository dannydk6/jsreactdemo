import React from 'react';
import ContestPreview from './ContestPreview';

// Stateless components are defined as objects.

// contests is deconstructed by including it in curly braces
const ContestList = ({ contests, onContestClick }) => (
	<div className="ContestList"> 
      {Object.keys(contests).map(contestId =>
      	<ContestPreview 
      		key={contestId} 
      		onClick={onContestClick}
      		{...contests[contestId]} />
      )}
    </div>
);

ContestList.propTypes = {
	contests: React.PropTypes.object,
	onContestClick: React.PropTypes.func.isRequired
};

export default ContestList;