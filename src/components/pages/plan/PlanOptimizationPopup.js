import Component from 'components/Component';
import Page from 'components/Page';
import React, { PropTypes } from 'react';
import popupStyle from 'styles/welcome/add-member-popup.css';

export default class AddObjectivePopup extends Component {

  styles = [popupStyle];

  static propTypes = {
    hidden: PropTypes.bool,
  };

  constructor(props){
    super(props);
  }

  render() {
    return <div hidden={this.props.hidden} style={this.lo}>
      <Page popup={true} contentClassName={popupStyle.locals.content} innerClassName={popupStyle.locals.inner}>
        <div className={popupStyle.locals.title}>
          Optimization Chat
        </div>
      </Page>
    </div>
  }
}