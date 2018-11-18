import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import PlannedVsActualstyle from 'styles/plan/planned-actual-tab.css';
import ideasStyle from 'styles/campaigns/ideas.css';
import Button from 'components/controls/Button';
import AddIdeaPopup from 'components/pages/campaigns/AddIdeaPopup';
import commentStyle from 'styles/campaigns/comment.css';
import Avatar from 'components/Avatar';
import {getProfileSync} from 'components/utils/AuthService';
import {formatTimestamp} from 'components/utils/date';
import Table from 'components/controls/Table';

export default class Ideas extends Component {

  style = style;
  styles = [PlannedVsActualstyle, ideasStyle, commentStyle];

  static defaultProps = {
    campaignIdeas: []
  };

  constructor(props) {
    super(props);
    this.state = {
      showAddIdeaPopup: false
    };
    this.addIdea = this.addIdea.bind(this);
  }

  addIdea(idea) {
    let update = this.props.campaignIdeas;
    update.push({
      ...idea,
      date: new Date(),
      owner: getProfileSync().user_id,
      endorsements: []
    });
    this.setState({showAddIdeaPopup: false});
    return this.props.updateUserMonthPlan({campaignIdeas: update}, this.props.region, this.props.planDate);
  }

  addLike(userId, index) {
    let update = this.props.campaignIdeas;
    if (!update[index].endorsements.includes(userId)) {
      update[index].endorsements.push(userId);
    }
    return this.props.updateUserMonthPlan({campaignIdeas: update}, this.props.region, this.props.planDate);
  }

  render() {
    const {campaignIdeas, auth} = this.props;
    const headRow = [
      'Owner',
      'Date',
      'Idea Name',
      'Idea Description',
      'Goal',
      'Endorsements',
      ''
    ];
    const rows = campaignIdeas.map((idea, i) => {
      const member = this.props.teamMembers.find(member => member.userId === idea.owner);
      return {
        items: [
          <div className={PlannedVsActualstyle.locals.cellItem}>
            <Avatar member={member} className={commentStyle.locals.initials}/>
          </div>,
          <div className={PlannedVsActualstyle.locals.cellItem}>
            {formatTimestamp(idea.date)}
          </div>,
          <div className={PlannedVsActualstyle.locals.cellItem}>
            {idea.name}
          </div>,
          <div className={PlannedVsActualstyle.locals.cellItem} style={{whiteSpace: 'pre-wrap'}}>
            {idea.description}
          </div>,
          <div className={PlannedVsActualstyle.locals.cellItem}>
            {idea.goal}
          </div>,
          <div className={PlannedVsActualstyle.locals.cellItem}>
            {idea.endorsements.length}
          </div>,
          <div className={ideasStyle.locals.like} onClick={this.addLike.bind(this, member.userId, i)}
               data-disabled={idea.endorsements.includes(member.userId) ? true : null}/>
        ]
      };
    });
    return <div>
      <Table headRowData={{items: headRow}}
             rowsData={rows}/>
      <div style={{justifyContent: 'center', display: 'flex'}}>
        <Button
          type="primary"
          style={{width: '75px', marginTop: '20px'}}
          onClick={() => {
            this.setState({showAddIdeaPopup: true});
          }}>+Add
        </Button>
      </div>
      <AddIdeaPopup
        hidden={!this.state.showAddIdeaPopup}
        close={() => {
          this.setState({showAddIdeaPopup: false});
        }}
        addIdea={this.addIdea}/>
    </div>;
  }
}