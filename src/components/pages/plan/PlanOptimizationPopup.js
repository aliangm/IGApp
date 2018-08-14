import Component from 'components/Component';
import Page from 'components/Page';
import React, { PropTypes } from 'react';
import ChatBot from 'react-simple-chatbot';
import style from 'styles/plan/plan-optimization-popup.css';

const steps = [
  {
    id: '0',
    message: 'Welcome to react chatbot!',
    trigger: '1',
  },
  {
    id: '1',
    message: 'Bye!',
    end: true,
  },
];

export default class AddObjectivePopup extends Component {

  style = style;

  static propTypes = {
    hidden: PropTypes.bool,
  };

  constructor(props){
    super(props);
  }

  render() {
    return <div hidden={this.props.hidden}>
      <Page popup={true} contentClassName={this.classes.content} innerClassName={this.classes.inner} centered={true}>
        <div className={this.classes.chatBot}>
          <ChatBot steps={steps} />
        </div>
      </Page>
    </div>
  }
}