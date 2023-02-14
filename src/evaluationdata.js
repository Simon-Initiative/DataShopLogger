/**
 * ActionEvaluation contains data relevant to Action Evalutation fields in
 * log messages.<p>This class mainly serves the purpose of internal message
 * management. All of the externally published logging methods that deal with
 * action evaluations will condense their arguments down to one of these objects
 * to be used with the internal logging methods.</p>
 *
 * @see http://pslcdatashop.web.cmu.edu/dtd/guide/tutor_message.html#element.action_evaluation Action Evaluation specification
 */
export default class ActionEvaluationData {

	/**
	*
	*/
	constructor (anEval) {
		this.classification="";
		this.currentHintNumber=-1;
		this.totalHintsAvailable=-1;
		this.hintID= "";
		this.evaluation=anEval;
  }

	/**
	 * Sets the classification of the ActionEvaluation.
	 * @param	classification	A string that classifies the evaluation.
	 */
	setClassification(classification) {
		this.classification = classification || "";
	}

	/**
	 * Returns whether or not that ActionEvaluation is of type "HINT"
	 * @return <code>true</code> if the ActionEvaluation describes a hint, <code>false</code> otherwise.
	 */
	isHint() {
		return (this.evaluation == "HINT");
	}

	/**
	 * Returns whether of not the ActionEvaluation has a classification.
	 * @return	<code>true</code> if the ActionEvaluation has a clasification, <code>false</code> otherwise.
	 */
	hasClassification() {
		return (this.classification != "");
	}

	/**
	 * Sets the current hint number value of the Action Evaluation.
	 * @param	hintNumber	The index of the current hint.
	 */
	setCurrentHintNumber(hintNumber) {
		this.currentHintNumber = hintNumber;
	}

	/**
	 * Sets the total number of hints available.
	 * @param	numHints	The total number of hints.
	 */
	setTotalHintsAvailable(numHints) {
		this.totalHintsAvailable = numHints;
	}

	/**
	 * Sets the id of the current hint
	 * @param	theID	A Hint ID
	 */
	setHintID(theID) {
		this.hintID = theID;
	}

	/**
	 * Returns the classification of the ActionEvaluation.
	 * @return	A classification of the action evaluation
	 */
	getClassification() {
		return this.classification;
	}

	/**
	 * Sets the evaluation field of the ActionEvaluation.
	 * @see		http://pslcdatashop.web.cmu.edu/dtd/guide/tutor_message.html#table.action_evaluation Reccomended Values for Action Evaluation
	 * @param	theEvaluation	The evaluation field of the ActionEvaluation
	 */
	setEvaluation(theEvluation) {
		this.evaluation = theEvluation;
	}

	/**
	 * Returns the evaluation field of the ActionEvaluation
	 * @return	The evaluation of the ActionEvaluation
	 */
	getEvaluation() {
		return this.evaluation;
	}

	/**
	 * Returns the ActionEvalution in its DataShop specified XML format.
	 * @return	An XMLString representation of the ActionEvaluation.
	 */
	getAttributeString() {
		var retString="";

		if (this.classification!== "") {
			retString += 'classification="' + this.classification + '" ';
		}

		if (!this.isHint()) {
			return retString;
		}

		if(this.currentHintNumber >= 0) {
			retString += 'current_hint_number="' + this.currentHintNumber + '" ';
		}
		if(this.totalHintsAvailable >= 0) {
			retString += 'total_hints_available="' + this.totalHintsAvailable + '" ';
		}

		if(this.hintID != null && this.hintID != "") {
			retString += 'hint_id="' + this.hintID + '" ';
		}

		return retString;
	}
}
