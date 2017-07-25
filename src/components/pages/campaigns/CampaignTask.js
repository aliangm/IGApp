import React from 'react';
import Component from 'components/Component';
import style from 'styles/campaigns/campaign-task.css';
import Textfield from 'components/controls/Textfield';
import Button from 'components/controls/Button';
import Calendar from 'components/controls/Calendar';
import { formatBudget } from 'components/utils/budget';

export default class CampaignTask extends Component {

  style=style

  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      budget: props.budget,
      description: props.description,
      dueDate: props.dueDate,
      showAdvanced: !props.isNew
    };
  }

  static defaultProps = {
    name: '',
    budget: '',
    description: '',
    dueDate: '',
    isNew: true
  };

  handleChangeName(event) {
    this.setState({name: event.target.value});
  }

  handleChangeBudget(event) {
    this.setState({budget: parseInt(event.target.value.replace(/[-$h,]/g, ''))})
  }

  handleChangeDescription(event) {
    this.setState({description: event.target.value});
  }

  handleChangeDate(value) {
    this.setState({dueDate: value});
  }

  addOrEditTask() {
    this.props.addOrEditTask(this.state.name, this.state.budget, this.state.description, this.state.dueDate, this.props.index);
    if (this.props.isNew) {
      this.setState({name: '', budget: '', description: '', dueDate: ''});
      this.refs.name.focus()
    }
  }

  openAdvancedOption() {
    this.setState({showAdvanced: true});
  }

  handleKeyPress(e) {
    if (e.key == 'Enter') {
      this.addOrEditTask();
    }
  }

  render() {
    return <div hidden={ this.props.hidden }>
      <div className={ this.classes.addItem }>
        <Textfield className={ this.classes.textField }value={ this.state.name } onChange={ this.handleChangeName.bind(this) } placeHolder="Add an item..." ref="name" onKeyPress={ this.handleKeyPress.bind(this) }/>
        <div className={ this.classes.advanced } onClick={ this.openAdvancedOption.bind(this) } hidden={ this.state.showAdvanced }>
          Advanced
        </div>
      </div>
      <div hidden={ !this.state.showAdvanced }>
        <Textfield className={ this.classes.textField } value={this.state.budget ? "$" + formatBudget(this.state.budget) : ""} onChange={ this.handleChangeBudget.bind(this) } placeHolder="Add a budget..."/>
        <textarea className={ this.classes.textArea } value={ this.state.description } onChange={ this.handleChangeDescription.bind(this) } placeholder="Add a description..."/>
        <div className={ this.classes.calendar }>
          <Calendar value={ this.state.dueDate } onChange={ this.handleChangeDate.bind(this) } placeholder="Add a due date..."/>
        </div>
      </div>
      <Button className={ this.classes.addOrEdit } type="accent2" style={{ width: '80px' }} onClick={ this.addOrEditTask.bind(this) }>
        {this.props.isNew ? "Add" : "Edit"}
      </Button>
    </div>
  }

}