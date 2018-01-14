import React from 'react';
import Component from 'components/Component';
import Tabs from 'components/onboarding/Tabs';
import style from 'styles/attribution/setup.css';
import copy from 'copy-to-clipboard';
import Textfield from 'components/controls/Textfield';
import Label from 'components/ControlsLabel';
import Select from 'components/controls/Select';
import Button from 'components/controls/Button';
import buttonsStyle from 'styles/onboarding/buttons.css';

export default class Setup extends Component {

  code = `<script>
    !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
    analytics.load("${this.props.attribution.key}");
    analytics.page();
    }}();
</script>`;

  style = style;
  styles = [buttonsStyle];

  static defaultProps = {
    attribution: {
      key: ''
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      copied: '',
      event: {
        type: '',
        name: '',
        description: '',
        url: ''
      }
    };
  };

  setTrackingCode() {
    const code =  `analytics.track('${this.state.event.name}', {
  type: '${this.state.event.type}'${this.state.event.description ? `,
  description: '${this.state.event.description}'` : ''}
});`;
    this.setState({
      event: {
        type: '',
        name: '',
        description: '',
        url: ''
      },
      trackingCode: code
    });
  }

  handleChange(parameter, e) {
    let event = this.state.event;
    event[parameter] = e.target.value;
    this.setState({event: event, showTrackingCode: false});
  }

  handleChangeSelect(parameter, e) {
    let event = this.state.event;
    event[parameter] = e.value;
    this.setState({event: event, showTrackingCode: false});
  }

  addEvent() {
    if (!this.state.event.type) {
      this.typeInput.focus();
    }
    else {
      this.setTrackingCode();
      let events = this.props.attribution.events;
      const event = this.state.event;
      events.push(event);
      this.props.updateUserMonthPlan({'attribution.events': events}, this.props.region, this.props.planDate);
      this.setState({
        showTrackingCode: true, event: {
          type: '',
          name: '',
          description: '',
          url: ''
        }
      });
    }
  }

  copy(value) {
    this.setState({copied: ''});
    copy(value);
    this.setState({copied: value});
  }

  getTab(index) {
    switch (index) {
      case 0:
        return this.getCode();
      case 1:
        return this.getIdentify();
      case 2:
        return this.getEvents();
    }
  }

  getCode() {
    return <div>
      <div className={ this.classes.text }>
        {`Place this snippet into the head of every page of your site (or site template).
        Also add it to 3rd-party sites that may be hosting your pages, such as WordPress, Hubspot, etc.`}
      </div>
      <div className={ this.classes.snippetBox }>
        <pre className={ this.classes.snippet }>
          { this.code }
          </pre>
      </div>
      <div className={ this.classes.codeWrap }>
        <Button type="reverse"
                onClick={ this.copy.bind(this, this.code) }
                icon="buttons:copy"
                style={{
                  width: '100px', marginBottom: '25px'
                }}
        >
          Copy
        </Button>
        <div className={ this.classes.copyMessage } hidden={ this.state.copied !== this.code }>
          Copied!
        </div>
      </div>
      <div className={ this.classes.text }>
        {`This will load the script and track all pageviews.`}
      </div>
    </div>;
  }

  getIdentify() {
    const identifyCode = `analytics.identify('{{ user.id }}', {
  name: '{{ user.fullname }}',
  email: '{{ user.email }}'
});`;
    return <div>
      <div className={ this.classes.text }>
        {`You will use analytics.identify to link a user’s actions and pageviews to a recognizable name or email address. You'll want to call analytics.identify whenever a user signs up or logs in.

        We recommend using the user ID field from your database and passing the email address in as a trait, in case a user changes their email address later on. You can pass us as many customer traits as you'd like to save. Here’s what a basic call to identify might look like:`}
      </div>
      <div className={ this.classes.snippetBox }>
      <pre className={ this.classes.snippet }>
        {`analytics.identify('599af2afc1195a13e8fd6d00', {
  name: 'Ramsey Bolton',
  email: 'ramsey@bolton.com'
});`}
      </pre>
      </div>
      <div className={ this.classes.text }>
        {`When you actually put that code on your site, you’ll need to replace all those hard-coded strings with details about the currently logged-in user.

To do that, we recommend using a backend template to inject an identify call straight into the footer of every page of your site where the user is logged in. That way, no matter what page the user first lands on, they will always be identified. You don’t need to call identify if your unique identifier (userId) is not known.

Depending on your templating language, that would look something like this:
`}
      </div>
      <div>
        <div className={ this.classes.snippetBox }>
      <pre className={ this.classes.snippet }>
        {identifyCode}
      </pre>
        </div>
        <div className={ this.classes.codeWrap }>
          <Button type="reverse"
                  onClick={ this.copy.bind(this, identifyCode) }
                  icon="buttons:copy"
                  style={{
                    width: '100px', marginBottom: '25px'
                  }}
          >
            Copy
          </Button>
          <div className={ this.classes.copyMessage } hidden={ this.state.copied !== identifyCode }>
            Copied!
          </div>
        </div>
      </div>
      <div className={ this.classes.text }>
        {`createdAt special trait. If you want to distinguish between new and existing customers in InfiniGrow, you must add the createdAt date only once when a new user registers. createdAt is expected to be date time (JavaScript date or ISO 8601 time format).`}
      </div>
      <div className={ this.classes.snippetBox }>
      <pre className={ this.classes.snippet }>
        {`analytics.identify(“45721864”, {
   name: “Jon Snow”,
   email: “jon@north.com”,
   createdAt: new Date() // Note: Only do this once!!!
 });`}
      </pre>
      </div>
    </div>;
  }

  getEvents() {
    const selects = {
      type: {
        select: {
          name: 'type',
          options: [
            {value: 'payment', label: 'payment'},
            {value: 'registration', label: 'registration'},
            {value: 'cancel', label: 'cancel'},
            {value: 'refund', label: 'refund'},
            {value: 'lead gen', label: 'lead gen'},
            {value: 'other', label: 'other'},
          ]
        }
      }
    };
    return <div>
      <div className={ this.classes.text }>
        {`The track method is how you tell InfiniGrow about which actions your users are performing on your site. Every action triggers what we call an “event”, which can also have associated properties. Properties can be anything you want to record. Run these JavaScript snippets inside an event/conversion, after a button has been clicked (or any other relevant action the user did).

        Create a conversion event:
        `}
      </div>
      <div className={ this.classes.addEvent }>
        <div className={ this.classes.row }>
          <Label className={ this.classes.label }>Event name:*</Label>
          <Textfield value={ this.state.event.name } onChange={ this.handleChange.bind(this, 'name') } style={{ width: '189px' }}/>
        </div>
        <div className={ this.classes.row }>
          <Label className={ this.classes.label }>Type:*</Label>
          <Select ref={ (input) => {this.typeInput = input} } { ... selects.type } selected={ this.state.event.type } onChange={ this.handleChangeSelect.bind(this, 'type') } style={{ width: '189px' }}/>
        </div>
        <div className={ this.classes.row }>
          <Label className={ this.classes.label }>Description:</Label>
          <Textfield value={ this.state.event.description } onChange={ this.handleChange.bind(this, 'description') } style={{ width: '189px' }}/>
        </div>
        <div className={ this.classes.row }>
          <Label className={ this.classes.label }>Web page url:</Label>
          <Textfield value={ this.state.event.url } onChange={ this.handleChange.bind(this, 'url') } style={{ width: '189px' }}/>
        </div>
        <Button
          type="accent2"
          style={{ width: '125px', marginTop: '20px' }}
          onClick={ this.addEvent.bind(this) }>Generate
        </Button>
      </div>
      {this.state.showTrackingCode ?
        <div>
          <div className={ this.classes.snippetBox }>
          <pre className={ this.classes.snippet }>
            {this.state.trackingCode}
          </pre>
          </div>
          <div className={ this.classes.codeWrap }>
            <Button type="reverse"
                    onClick={ this.copy.bind(this, this.state.trackingCode) }
                    icon="buttons:copy"
                    style={{
                      width: '100px', marginBottom: '25px'
                    }}
            >
              Copy
            </Button>
            <div className={ this.classes.copyMessage } hidden={ this.state.copied !== this.state.trackingCode }>
              Copied!
            </div>
          </div>
        </div>
        : null }
    </div>;
  }

  render() {
    return <div>
      <Tabs
        ref="tabs"
        defaultSelected={ 0 }
        defaultTabs={["1. Place Tracking Code", "2. Identify Users", "3. Send Conversion Events"]}
      >
        {({ name, index }) => {
          return <div className={ this.classes.wrap }>
            { this.getTab(index) }
          </div>
        }}
      </Tabs>
    </div>
  }
}