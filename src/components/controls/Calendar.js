import React from 'react';
import Component from 'components/Component';

import calendarStyle from 'rc-calendar/assets/index.css';
import RcCalendar from 'rc-calendar';
import DatePicker from 'rc-calendar/lib/Picker';
import DateTimeFormat from 'gregorian-calendar-format';
import GregorianCalendar from 'gregorian-calendar';
import _CalendarLocale from 'rc-calendar/lib/locale/en_US';
import assign from 'object-assign';

import en_US from 'gregorian-calendar/lib/locale/en_US';

import Textfield from 'components/controls/Textfield';

import style from 'styles/controls/calendar.css';

// Change locale
const CalendarLocale = assign({}, _CalendarLocale, {
  monthFormat: 'MMMM',
});

// const dateFormatter = new DateTimeFormat('MM/dd/yyyy');
const dateFormatter = new DateTimeFormat('MM-dd-yyyy');

// const defaultCalendarValue = new GregorianCalendar(en_US);
// defaultCalendarValue.setTime(Date.now());
// defaultCalendarValue.addMonth(-1);

const defaultCalendarValue = new GregorianCalendar(en_US);
defaultCalendarValue.setTime(Date.now());

export default class Calendar extends Component {
  style = style;
  styles = [calendarStyle];
  state = {
    value: null,
    open: false
  }

  onChange = (value) => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(dateFormatter.format(value));
    }
  }

  openCalendar = () => {
    this.refs.picker.onVisibleChange(true);
  }

  render() {
    const calendar = <RcCalendar
      locale={ CalendarLocale }
      style={{ zIndex: 1000 }}
      formatter={ dateFormatter }
      disabledTime={ null }
      timePicker={ null }
      defaultValue={ this.props.value ? dateFormatter.parse(this.props.value) : defaultCalendarValue }
      showDateInput={ false }
      disabledDate={ disabledDate }
    />;

    return <div className={ this.classes.box }>
      <DatePicker
        ref="picker"
        disabled={ false }
        calendar={ calendar }
        value={ this.state.value }
        formatter={ dateFormatter }
        onChange={ this.onChange }
        defaultValue={ this.props.value ? dateFormatter.parse(this.props.value) : defaultCalendarValue }
      >
        {({ value }) => {
          return <Textfield
            className={ this.classes.input }
            onFocus={ this.openCalendar }
            readOnly
            value={ this.props.value }
          />
        }}
      </DatePicker>
      <div className={ this.classes.icon } onClick={ this.openCalendar } />
    </div>
  }
}

function disabledDate(current) {
  if (!current) {
    // allow empty select
    return false;
  }
  const date = new Date();
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return current.getYear() + 10 < date.getFullYear();  // can not select days before today
}