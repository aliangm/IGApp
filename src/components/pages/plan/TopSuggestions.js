import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/top-suggestions.css';
import Suggestion from 'components/pages/plan/Suggestion';

export default class TopSuggestions extends Component {

  style = style;

  constructor(props) {
    super(props);
    this.state = {
      active: false
    }
  }

  render() {
    const suggestionsOrdered = this.props.approvedBudgets[0] ? Object.keys(this.props.approvedBudgets[0])
        .filter(item => (this.props.projectedPlan[0].plannedChannelBudgets[item] || 0) !== (this.props.approvedBudgets[0][item] || 0))
        .map(item => {
          return {
            channel: item,
            suggested: this.props.projectedPlan[0].plannedChannelBudgets[item] || 0,
            current: this.props.approvedBudgets[0][item] || 0
          } })
        .sort((a, b) => Math.abs(b.suggested - b.current) - Math.abs(a.suggested - a.current))
      : [];
    const topSuggestions = suggestionsOrdered.slice(0, 5).map(item =>
      <Suggestion
        {... item}
        key={item.channel}
        approveChannel={ () => { this.props.approveChannel(0, item.channel, item.suggested) } }
        declineChannel={ () => { this.props.declineChannel(0, item.channel, item.current) } }
      />
    );
    return <div>
      <div className={this.classes.title} onClick={ () => { this.setState({active: !this.state.active}) } } data-active={ this.state.active ? true : null }>
        Top Suggestions
      </div>
      <div hidden={ !this.state.active }>
        <div className={this.classes.innerPos}>
          <div className={this.classes.inner}>
            {
              topSuggestions && topSuggestions.length > 0
                ?
                topSuggestions
                :
                <div className={this.classes.noSuggestionsPos}>
                  <div className={this.classes.noSuggestionsText}>
                    Great - no more suggestions for this month :)
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  }

}