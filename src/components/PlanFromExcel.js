import React from "react";
import Component from "components/Component";
import style from 'styles/plan-from-excel.css';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import Label from 'components/ControlsLabel';
import { isPopupMode } from 'modules/popup-mode';
import Notice from 'components/Notice';
import { getTitle } from 'components/utils/channels';

export default class PlanFromExcel extends Component {

  style=style;

  static defaultProps = {
    planDate: null
  };

  constructor(props) {
    super(props);
    this.state = {
      successUpload: null
    };
  }

  handleCSV(files) {
    this.setState({successUpload: null});
    let firstTime = new Array(12).fill(true);
    Papa.parse(files[0], {complete: (result, file) => {
      try {
        let approvedBudgets = this.props.approvedBudgets;
        result.data.forEach((row, index) => {
          if (index > 0) {
            const channel = row[0];
            row.forEach((cell, cellIndex) => {
              if (cell != '' && cellIndex > 1) {
                const budget = parseInt(cell.replace(/[-$h,]/g, ''));
                if (budget && firstTime[cellIndex - 2]) {
                  approvedBudgets[cellIndex - 2] = {};
                  firstTime[cellIndex - 2] = false;
                }
                approvedBudgets[cellIndex - 2][channel] = budget;
              }
            })
          }
        });
        // Validate
        let isValid = true;
        approvedBudgets.forEach(month => {
          Object.keys(month).forEach((channel) => {
            const title = getTitle(channel);
            if (!title || isNaN(month[channel])) {
              isValid = false;
            }
          })
        });
        if (isValid) {
          this.props.updateUserMonthPlan({approvedBudgets: approvedBudgets}, this.props.region, this.props.planDate);
          this.setState({successUpload: true})
        }
        else {
          this.setState({successUpload: false})
        }

      }
      catch(err) {
        this.setState({successUpload: false})
      }
    },
      error: (err, file) => {
        this.setState({successUpload: false})
      }});
  }

  render() {
    const csv = this.props.planDate ? 'excel-templates/' + this.props.planDate.split('/')[0] + '.csv' : null;
    return <div>
      <Label className={ this.classes.title }>Upload your existing plan (optional)</Label>
      <Notice warning style={{
        margin: '12px 0'
      }}>
        Please use the following csv template to upload your existing plan (keep it in the same format).
        { isPopupMode ? <div>Please notice that uploading an existing plan will override your current approved plan in InfiniGrow</div> : null}
      </Notice>
      <a href={ csv } download="marketing-activities.csv">Click here to download the plan template (excel)</a>
      <Dropzone onDropAccepted={ this.handleCSV.bind(this) } className={ this.classes.dropZone } activeClassName={ this.classes.dropZoneActive }>
        <div className={ this.classes.inner }>
          <div className={ this.classes.iconWrap }>
            <div className={ this.classes.icon}/>
          </div>
          <div className={ this.classes.innerText }>Drag & drop your plan (excel) here, or browse.</div>
        </div>
      </Dropzone>
      <div className={ this.classes.message }>
        <label hidden={ this.state.successUpload !== true} style={{ color: 'green' }}>Added successfully.</label>
        <label hidden={ this.state.successUpload !== false} style={{ color: 'red' }}>Failed to upload. Please use the template.</label>
      </div>
    </div>
  }
}