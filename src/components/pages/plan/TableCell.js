import React, {PropTypes} from 'react';
import Component from 'components/Component';
import style from 'styles/plan/annual-tab.css';
import EditableCell from 'components/pages/plan/EditableCell';
import planStyle from 'styles/plan/plan.css';
import cellStyle from 'styles/plan/plan-cell.css'

export default class TableCell extends Component {

  style = style;
  styles = [cellStyle, planStyle];

  static propTypes = {
    primaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    secondaryValue: PropTypes.string,
    isConstraitsEnabled: PropTypes.bool,
    key: PropTypes.number,
    lockChannel: PropTypes.func,
    likeChannel: PropTypes.func,
    className: PropTypes.string,
    isEditMode: PropTypes.bool,
    onChange: PropTypes.func,
    acceptSuggestion: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      hoverCell: false
    }
  }

  //

  render() {
    const showSuggestion = this.props.secondaryValue && (this.props.secondaryValue !== this.props.primaryValue);

    return  this.props.isEditMode ?
      <td className={this.classes.valueCell} key={this.props.key}>
        <EditableCell
        value={this.props.primaryValue}
        onChange={this.props.onChange}
        />
      </td>
    : <td
        className={ this.classes.valueCell }
        onMouseEnter={() => { this.setState({hoverCell: true}) }}
        onMouseLeave={() => { this.setState({hoverCell: false}) }}
        style={ this.props.style }
        key={this.props.key}>

          <div hidden={ !this.state.hoverCell }>
            {this.props.isConstraitsEnabled ?
              <div>
                <div className={ cellStyle.locals.hover }>
                  <div className={ planStyle.locals.left }>
                    <div className={ cellStyle.locals.lock } onClick={ this.props.lockChannel }/>
                  </div>
                  <div className={ planStyle.locals.right }>
                    <div className={ cellStyle.locals.like } onClick={ this.props.likeChannel }/>
                  </div>
                </div>
              </div> : null }
          </div>
          <div className={ this.classes.cellItem } style={{ color: this.state.hoverCell ? '#D75A4A' : '#1991eb' }}>
            { !this.state.hoverCell && showSuggestion ? '*' : '' }{this.props.primaryValue}
            {showSuggestion ?
              <div>
                <div hidden={ !this.state.hoverCell } className={ cellStyle.locals.budget } style={{ color: '#25AE88'}}>
                  ({ this.props.secondaryValue })
                </div>
                <div className={ planStyle.locals.right }>
                  <div className={ cellStyle.locals.accept } onClick={ this.props.acceptSuggestion }/>
                </div>
              </div> : null }
          </div>
        </td>
  }
}