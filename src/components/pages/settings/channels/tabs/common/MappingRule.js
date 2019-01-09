import React from 'react';
import Component from 'components/Component';
import Select from 'components/controls/Select';
import style from 'styles/settings/channels/channels-tab.css';
import Textfield from 'components/controls/Textfield';
import PropTypes from 'prop-types';

const paramsOptions = [
  {value: 'source', label: 'source'},
  {value: 'medium', label: 'medium'},
  {value: 'referrer', label: 'referrer'}
];

const operationOptions = [
  {value: 'equals', label: 'equals'},
  {value: 'contains', label: 'contains'}
];

const MARGIN_RIGHT = '15px';
const ruleSelectStyle = {width: '131px', marginRight: MARGIN_RIGHT};

export default class MappingRule extends Component {

  style = style;

  static propTypes = {
    param: PropTypes.oneOf(paramsOptions.map(item => item.value)),
    operation: PropTypes.oneOf(operationOptions.map(item => item.value)),
    value: PropTypes.string,
    updateParam: PropTypes.func,
    updateOperation: PropTypes.func,
    updateValue: PropTypes.func,
    withAddAndDelete: PropTypes.bool,
    handleDelete: PropTypes.func,
    handleAdd: PropTypes.func
  };

  static defaultProps = {
    withAddAndDelete: true
  };

  setRef = (ref) => {
    if (this.props.getRef) {
      this.props.getRef(ref);
    }
  };

  render() {
    const {param, operation, value, updateParam, updateOperation, updateValue, withAddAndDelete, handleDelete, handleAdd} = this.props;
    return <div className={this.classes.flexRow}>
      <Select select={{options: paramsOptions}} style={ruleSelectStyle}
              selected={param}
              onChange={updateParam}/>
      <Select select={{options: operationOptions}} style={ruleSelectStyle}
              selected={operation}
              onChange={updateOperation}/>
      <Textfield value={value}
                 style={{marginRight: MARGIN_RIGHT}}
                 onChange={updateValue}
                 ref={this.setRef}/>
      {withAddAndDelete ?
        <div className={this.classes.rowIcons}>
          <div className={this.classes.minusIcon}
               onClick={handleDelete}/>
          <div className={this.classes.plusIcon} onClick={handleAdd}/>
        </div>
        : null}
    </div>;
  }
}