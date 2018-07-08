import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/editable-cell.css';

export default class EditableCell extends Component {

  style=style;

  constructor(props) {
    super(props);
    this.state = {
      dragged: null,
      previousValue: null,
      firstOfDrag: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDragging === false) {
      if(nextProps.draggableValue && this.state.dragged && !this.state.firstOfDrag && this.state.previousValue === null){
        this.setState({ previousValue: this.props.value });
      }

      this.setState({
        dragged: null,
        firstOfDrag: false
      });
    }
  }

  handleFocus(event) {
    event.target.select();
  }

  dragStart(event) {
    this.setState({
      dragged: true,
      firstOfDrag: true
    });

    this.props.dragStart(event.target.value);
  }

  dragEnter(event) {
    event.preventDefault();
    this.setState({ dragged: true });
    this.props.dragEnter(this.props.i, this.props.channel);
  }

  drop(event) {
    event.preventDefault();
    this.props.drop();
  }

  returnToPreviousValue = () => {
    this.props.onChange(this.state.previousValue);
    this.setState({ previousValue: null })
  }

  onChange = (value) => {
    if(this.state.previousValue === null){
      this.setState({ previousValue: this.props.value });
    }

    this.props.onChange(value);
  }

  render() {

    return <div style={{ height: '100%', cursor: 'grabbing' }}>
      <input
        title={ this.props.title }
        type="text"
        value={ this.props.value }
        className={ this.classes.edit }
        data-dragged={ this.state.dragged }
        onChange={ (event) => this.onChange(event.target.value) }
        onFocus={ this.handleFocus.bind(this) }
        onDragStart={ this.dragStart.bind(this) }
        onDrop={ this.drop.bind(this) }
        onDragEnter={ this.dragEnter.bind(this) }/>

      { this.state.previousValue !== null ? <div onClick={ this.returnToPreviousValue } className={ this.classes.undoButton } /> : null }
    </div>
  }

}