import React from 'react';
import Component from 'components/Component';
import style from 'styles/onboarding/onboarding.css';
import PlannedVsActualstyle from 'styles/plan/planned-actual-tab.css';
import ideasStyle from 'styles/campaigns/ideas.css';
import Button from 'components/controls/Button';
import AddIdeaPopup from 'components/pages/campaigns/AddIdeaPopup';
import setupStyle from 'styles/attribution/setup.css';
import commentStyle from 'styles/campaigns/comment.css';

export default class Ideas extends Component {

  style = style;
  styles = [PlannedVsActualstyle, ideasStyle, setupStyle, commentStyle];

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
      ... idea,
      date: new Date(),
      owner: this.props.auth.getProfile().user_id,
      endorsements: []
    });
    this.setState({showAddIdeaPopup: false});
    if (!this.props.userAccount.steps || !this.props.userAccount.steps.campaignIdea) {
      this.props.updateUserAccount({'steps.campaignIdea': true});
    }
    return this.props.updateUserMonthPlan({ campaignIdeas: update }, this.props.region, this.props.planDate);
  }

  addLike(userId, index) {
    let update = this.props.campaignIdeas;
    if (!update[index].endorsements.includes(userId)) {
      update[index].endorsements.push(userId);
    }
    return this.props.updateUserMonthPlan({ campaignIdeas: update }, this.props.region, this.props.planDate);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  render() {
    const { campaignIdeas, auth } = this.props;
    const headRow = this.getTableRow(null, [
      'Owner',
      'Date',
      'Idea Name',
      'Idea Description',
      'Goal',
      'Endorsements',
      ''
    ], {
      className: setupStyle.locals.headRow
    });
    const userId = auth.getProfile().user_id;
    const rows = campaignIdeas.map((idea, i) => {
      let firstName = this.props.userAccount.firstName;
      let lastName = this.props.userAccount.lastName;
      let pictureUrl = this.props.userAccount.pictureUrl;
      const member = this.props.teamMembers.find(member => member.userId === idea.owner);
      if (member) {
        pictureUrl = member.pictureUrl;
        [firstName = '', lastName = ''] = member.name.split(' ');
      }
      const initials = (firstName[0] || '') + (lastName[0] || '');
      return this.getTableRow(null, [
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { pictureUrl ?
            <div className={ideasStyle.locals.userLogo} style={{backgroundImage: 'url(' + pictureUrl + ')'}}/>
            :
            <div className={commentStyle.locals.initials}>{initials}</div>
          }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { this.formatDate(idea.date) }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { idea.name }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem } style={{ whiteSpace:  'pre-wrap'}}>
          { idea.description }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { idea.goal }
        </div>,
        <div className={ PlannedVsActualstyle.locals.cellItem }>
          { idea.endorsements.length }
        </div>,
        <div className={ideasStyle.locals.like} onClick={this.addLike.bind(this, userId, i)} data-disabled={ idea.endorsements.includes(userId) ? true : null }/>
      ], {
        key: i
      });
    });
    return <div>
      <div className={ PlannedVsActualstyle.locals.wrap } ref="wrap" style={{ margin: '40px 40px' }}>
        <div className={ PlannedVsActualstyle.locals.box } style={{ overflow: 'visible' }}>
          <table className={ PlannedVsActualstyle.locals.table }>
            <thead>
            { headRow }
            </thead>
            <tbody className={ setupStyle.locals.tableBody }>
            { rows }
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ justifyContent: 'center', display: 'flex' }}>
        <Button
          type="reverse"
          style={{ width: '75px', marginTop: '20px' }}
          onClick={ () => { this.setState({showAddIdeaPopup: true}) } }>+Add
        </Button>
      </div>
      <AddIdeaPopup
        hidden={ !this.state.showAddIdeaPopup }
        close={ ()=>{ this.setState({showAddIdeaPopup: false}) } }
        addIdea={ this.addIdea }/>
    </div>
  }

  getTableRow(title, items, props) {
    return <tr {... props}>
      { title != null ?
        <td className={ PlannedVsActualstyle.locals.titleCell }>{ this.getCellItem(title) }</td>
        : null }
      {
        items.map((item, i) => {
          return <td className={ PlannedVsActualstyle.locals.valueCell } key={ i }>{
            this.getCellItem(item)
          }</td>
        })
      }
    </tr>
  }

  getCellItem(item) {
    let elem;

    if (typeof item !== 'object') {
      elem = <div className={ PlannedVsActualstyle.locals.cellItem }>{ item }</div>
    } else {
      elem = item;
    }

    return elem;
  }
}