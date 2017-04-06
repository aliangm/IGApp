import React, { PropTypes } from 'react';
import Component from 'components/Component';

import Masonry from 'react-masonry-component';
import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import Explanation from 'components/pages/plan/Explanation';
import ChannelCube, { formatPrice } from 'components/pages/plan/ChannelCube';
import { parseAnnualPlan } from 'data/parseAnnualPlan';

import style from 'styles/plan/current-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';

function formatDate(dateStr) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [monthNum, yearNum] = dateStr.split("/");

  return `${monthNames[monthNum - 1]} ${yearNum}`;
}

export default class CurrentTab extends Component {
  static propTypes = {
    planDate: PropTypes.string,
    projectedPlan: PropTypes.array,
    isLoaded: PropTypes.bool,
  };

  static defaultProps = {
    isLoaded: true,
  };

  styles = [planStyles, icons];
  style = style;

  render() {
    const { isLoaded, planDate, projectedPlan, isPlannerLoading } = this.props;

    if (!isLoaded) {
      return null;
    }
    if (isPlannerLoading) {
      return (
        <div className={ this.classes.wrap } data-loading="true">
          <div className={ this.classes.loading }>
            <Popup className={ this.classes.popup }>
              <div>
                <Loading />
              </div>

              <div className={ this.classes.popupText }>
                Please wait while the system creates your plan
              </div>
            </Popup>
          </div>
        </div>
      );
    }
    const planJson = parseAnnualPlan(projectedPlan);
    const planData = planJson[Object.keys(planJson)[0]];
    const planDataChannels = Object.keys(planData).filter(channelName => channelName !== '__TOTAL__');
    const monthBudget = planDataChannels.reduce((res, key) => res + planData[key].values[0], 0);

    const events = this.props.events ?
      this.props.events.map((event, index) => {
        return <p key={ index }>
          {event.link ? <a href={event.link} target="_blank">{event.eventName}</a> : event.eventName } {event.startDate} {event.location}
        </p>
      })
      : null;

    return <div className={ this.classes.wrap }>
      <div className={ planStyles.locals.title }>
        <div className={ planStyles.locals.titleMain }>
          <div className={ planStyles.locals.titleText }>
            {formatDate(planDate)}: Recommended budget
          </div>
          <div className={ planStyles.locals.titlePrice }>{formatPrice(monthBudget)}</div>
        </div>
        <div className={ planStyles.locals.titleButtons }>
          <Button type="accent2" style={{
            width: '106px'
          }} onClick={() => {
            this.refs.eventsPopup.open();
          }}>Events</Button>

          <div style={{ position: 'relative' }}>
            <PlanPopup ref="eventsPopup" style={{
              width: '367px',
              right: '0',
              left: 'auto',
              top: '20px'
            }} title="EVENTS">
              <PopupTextContent>
                {events}
              </PopupTextContent>
            </PlanPopup>
          </div>
        </div>
      </div>
      <div className={ this.classes.innerBox }>
        <Masonry className={ this.classes.boxesContainer } options={{
          fitWidth: true,
          gutter: 15
        }}>
          {
            planDataChannels.map((channelName) => (
              <ChannelCube
                key={channelName}
                title={channelName}
                data={planData[channelName]}
                month={0}
                monthBudget={monthBudget}
              />
            ))
          }
        </Masonry>
      </div>
      {/*
       <Explanation title="Explanation" text="Your strategy was built based on 89 experts and statistical analysis of 23 similar companies.
       The 2 main fields (channels) that are recommended to you in the current month are: Advertising and Public Relations. 81% of similar companies to yours are using Advertising as the main channel in their strategy in we thought that you should too. In contrary, only 22% of these companies are using Public Relations as one of the main channels. But in your case, we thought that this channel would be a perfect fit to your marketing mix due to the fact that your main goal is getting as much awareness as possible." />
       */}
    </div>
  }
}
