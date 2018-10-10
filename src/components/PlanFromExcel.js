import React from 'react';
import Component from 'components/Component';
import style from 'styles/plan-from-excel.css';
import Dropzone from 'react-dropzone';
import Label from 'components/ControlsLabel';
import Select from 'components/controls/Select';
import Textfield from 'components/controls/Textfield';
import onboardingStyle from 'styles/onboarding/onboarding.css';
import {getDates, NUMBER_OF_FUTURE_MONTHS} from 'components/utils/date';
import XLSX from 'xlsx';
import offlineStyle from 'styles/attribution/upload-offline-popup.css';
import MultiRow from 'components/MultiRow';
import {formatChannels} from 'components/utils/channels';
import Page from 'components/Page';
import Button from 'components/controls/Button';
import Title from 'components/onboarding/Title';
import {extractNumberFromBudget} from 'components/utils/budget';

export default class PlanFromExcel extends Component {

  style = style;
  styles = [onboardingStyle, offlineStyle];

  static defaultProps = {
    planDate: null
  };

  constructor(props) {
    super(props);
    this.state = {
      monthsCells: ['B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1', 'K1', 'L1', 'M1'],
      channels: {},
      worksheet: {},
      fileName: ''
    };
  }

  handleChangeMonth = (value, index) => {
    const newMonthCells = [...this.state.monthsCells];
    newMonthCells[index] = value;
    this.setState({monthsCells: newMonthCells});
  };

  channelRemove = (index) => {
    const channels = {...this.state.channels};
    const channel = Object.keys(channels)[index];
    delete channels[channel];
    this.setState({channels: channels});
  };

  handleChangeChannelKey = (channel, index) => {
    const channels = {...this.state.channels};
    const existingChannels = Object.keys(channels);
    const numOfChannels = existingChannels.length;
    // New line
    if (index === numOfChannels) {
      if (!channels[channel]) {
        channels[channel] = `A${index + 2}`;
      }
    }
    else {
      // Existing line
      const oldChannel = existingChannels[index];
      channels[channel] = channels[oldChannel];
      delete channels[oldChannel];
    }
    this.setState({channels: channels});
  };

  handleChangeChannelCell = (value, channel) => {
    const channels = {...this.state.channels};
    channels[channel] = value;
    this.setState({channels: channels});
  };

  parseExcel = (files) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let data = e.target.result;
      data = new Uint8Array(data);
      const workbook = XLSX.read(data, {type: 'array', cellDates: true});
      const first_sheet_name = workbook.SheetNames[0];

      /* Get worksheet */
      const worksheet = workbook.Sheets[first_sheet_name];
      this.setState({worksheet: worksheet});
    };
    this.setState({fileName: files[0].name});
    reader.readAsArrayBuffer(files[0]);
  };

  upload = () => {
    const {worksheet, monthsCells, channels} = this.state;
    let planBudgets = this.props.planBudgets.length > 0 ? this.props.planBudgets : new Array(NUMBER_OF_FUTURE_MONTHS).fill(null);

    const channelsKeys = Object.keys(channels);

    monthsCells.forEach((month, monthIndex) => {
      if (month) {
        const column = month.replace(/[0-9]/g, '');

        channelsKeys.forEach(channelKey => {
          if (channels[channelKey]) {
            // Remove letters
            const row = channels[channelKey].replace(/\D/g, '');
            const budget = extractNumberFromBudget(worksheet[column + row] && worksheet[column + row].v);
            planBudgets[monthIndex][channelKey] = {
              isSoft: false,
              committedBudget: budget,
              userBudgetConstraint: budget
            };
          }
        });
      }
    });

    this.props.updateState({planBudgets: planBudgets});
    this.closePopup();
  };

  closePopup = () => {
    this.setState({worksheet: {}, fileName: ''});
  };

  render() {
    const {worksheet, monthsCells, channels, fileName} = this.state;
    const {planDate} = this.props;
    const dates = getDates(planDate);
    const channelKeys = Object.keys(channels);
    const channelsCells = Object.values(channels);
    const channelsOptions = formatChannels();
    const monthsRows = dates
      .map((month, index) => <div className={offlineStyle.locals.row} key={index}>
        <div className={offlineStyle.locals.field} style={{width: '100px'}}>
          {month}
        </div>
        <Textfield value={monthsCells[index]}
                   onChange={e => this.handleChangeMonth(e.target.value.toUpperCase(), index)}
                   style={{width: '80px', marginLeft: '20px'}} placeHolder={`${String.fromCharCode(66 + index)}1`}/>
        <Textfield value={worksheet && worksheet[monthsCells[index]] && worksheet[monthsCells[index]].v}
                   style={{width: '100px', marginLeft: '20px'}} readOnly={true} disabled={!monthsCells[index]}/>
      </div>);
    return <div>
      <Label className={this.classes.title}>Upload your existing plan (optional)</Label>
      <Dropzone onDropAccepted={this.parseExcel} className={this.classes.dropZone}
                activeClassName={this.classes.dropZoneActive}>
        <div className={this.classes.inner}>
          <div className={this.classes.iconWrap}>
            <div className={this.classes.icon}/>
          </div>
          <div className={this.classes.innerText}>Drag & drop your plan (excel) here, or browse.</div>
        </div>
      </Dropzone>
      {worksheet && Object.keys(worksheet).length > 0 ?
        <Page popup={true} width={'600px'} contentClassName={offlineStyle.locals.content}
              innerClassName={offlineStyle.locals.inner}>
          <Title title="" subTitle="Map the cells for the months and channels headers." popup={true}/>
          <div className={offlineStyle.locals.fileName}>
            {fileName}
          </div>
          <div className={offlineStyle.locals.title}>
            Months
          </div>
          {monthsRows}
          <div className={offlineStyle.locals.title} style={{marginTop: '40px'}}>
            Channels
          </div>
          <MultiRow numOfRows={channelKeys.length} rowRemoved={this.channelRemove}>
            {({index, data, update, removeButton}) => {
              return <div className={offlineStyle.locals.row} style={{margin: '7px 0'}}>
                <Select
                  style={{width: '230px'}}
                  selected={channelKeys[index]}
                  select={{
                    options: channelsOptions
                  }}
                  onChange={(e) => this.handleChangeChannelKey(e.value, index)}
                />
                <Textfield value={channelsCells[index]}
                           onChange={e => this.handleChangeChannelCell(e.target.value.toUpperCase(), channelKeys[index])}
                           style={{width: '80px', marginLeft: '20px'}} placeHolder={`A${index + 2}`}
                           disabled={!channelKeys[index]}/>
                <Textfield value={worksheet && worksheet[channelsCells[index]] && worksheet[channelsCells[index]].v}
                           style={{width: '100px', marginLeft: '20px'}} readOnly={true}
                           disabled={!channelsCells[index]}/>
                <div style={{marginLeft: '25px', alignSelf: 'center'}}>
                  {removeButton}
                </div>
              </div>;
            }}
          </MultiRow>
          <div className={offlineStyle.locals.buttons}>
            <Button type="secondary" style={{width: '100px'}} onClick={this.closePopup}>Cancel</Button>
            <Button type="primary" style={{width: '100px', marginLeft: 'auto'}}
                    onClick={this.upload}>Done</Button>
          </div>
        </Page>
        : null}
    </div>;
  }
};