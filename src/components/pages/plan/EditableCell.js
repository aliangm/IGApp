import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan/editable-cell.css';

export default class EditableCell extends Component {

  style=style;

  constructor(props) {
    super(props);
    this.state = {
      dragged: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isDragging === false) {
      this.setState({dragged: null});
    }
  }

  handleFocus(event) {
    event.target.select();
  }

  dragStart(event) {
    this.setState({dragged: true});
    this.props.dragStart(event.target.value);
  }

  dragEnter(event) {
    event.preventDefault();
    this.setState({dragged: true});
    this.props.dragEnter(this.props.i, this.props.channel);
  }

  drop(event) {
    event.preventDefault();
    this.props.drop();
  }

  render() {

    return <div style={{ height: '100%', cursor: 'grabbing' }}>
      <input
        title={ this.props.title }
        type="text"
        value={ this.props.value }
        className={ this.classes.edit }
        data-dragged={ this.state.dragged }
        onChange={ this.props.onChange }
        onFocus={ this.handleFocus.bind(this) }
        onDragStart={ this.dragStart.bind(this) }
        onDrop={ this.drop.bind(this) }
        onDragEnter={ this.dragEnter.bind(this) }/>
    </div>
  }

}