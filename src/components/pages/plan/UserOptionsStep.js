import Component from 'components/Component';
import React, {PropTypes} from 'react';

export default class UserOptionsStep extends Component {

  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      trigger: PropTypes.string.isRequired
    })).isRequired
  };

  constructor(props){
    super(props);
    this.state = {chosenKey: null};
  }

  render() {
    const options = this.props.options.map(({label, trigger}, key) => {
      return <div key={key} onClick={() => {
        this.setState({chosenKey: key});
        this.props.triggerNextStep({trigger: trigger})
      }}>
        {label}
      </div>
    });

    return <div>
      {this.state.chosenKey ? options[this.state.chosenKey] : options}
    </div>;
  }
}