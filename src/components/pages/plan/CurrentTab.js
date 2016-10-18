import React from 'react';
import Component from 'components/Component';

import Box, {
  Row as BoxRow,
  Level as BoxLevel,
  LeveledRow as BoxLeveledRow
} from 'components/pages/plan/Box';

import Masonry from 'react-masonry-component';
import Popup from 'components/Popup';
import Loading from 'components/pages/plan/Loading';
import Button from 'components/controls/Button';
import PlanPopup, {
  TextContent as PopupTextContent
} from 'components/pages/plan/Popup';
import Explanation from 'components/pages/plan/Explanation';

import style from 'styles/plan/current-tab.css';
import planStyles from 'styles/plan/plan.css';
import icons from 'styles/icons/plan.css';

export default class CurrentTab extends Component {
  styles = [planStyles, icons];
  style = style;
  state = {
    loading: true,
    loadingExists: true
  }

  render() {
    return <div className={ this.classes.wrap } data-loading={ this.state.loading ? true : null }>
      <div className={ planStyles.locals.title }>
        <div className={ planStyles.locals.titleMain }>
          <div className={ planStyles.locals.titleText }>
            Jan 2016: Recommended budget
          </div>
          <div className={ planStyles.locals.titlePrice }>
            $24,600
          </div>
        </div>
        <div className={ planStyles.locals.titleButtons }>
          <Button type="accent2" style={{
            width: '106px'
          }} onClick={() => {
            this.refs.eventsPopup.open();
          }}>Events</Button>

          <div style={{ position: 'relative' }}>
            <PlanPopup ref="eventsPopup" style={{
              width: '367px',
              right: '0',
              left: 'auto',
              top: '20px'
            }} title="EVENTS">
              <PopupTextContent>
                <strong>User Events</strong>
                <p>With the exception of Nietzsche, no other madman has contributed so much to human sanity as has Louis Althusser. He is mentioned twice in the Encyclopaedia Britannica as someone’s teacher.</p>
                <strong>Global Events</strong>
                <p>Thought experiments (Gedankenexperimenten) are “facts” in the sense that they have a “real life” correlate in the form of electrochemical activity in the brain. But it is quite obvious that they do not</p>
              </PopupTextContent>
            </PlanPopup>
          </div>
        </div>
      </div>
      <div className={ this.classes.innerBox }>
        <Masonry className={ this.classes.boxesContainer } options={{
          fitWidth: true,
          gutter: 15
        }}>
          <Box className={ this.classes.box } title="Social" price="$2,000" progress={ 8 }
            onInfoClick={() => {
              this.refs.boxPopup1.open();
            }}
          >
            <BoxRow icon="plan:facebook" title="Facebook" price="$1,000" />
            <BoxRow icon="plan:twitter" title="Twitter" price="$1,000" onInfoClick={(e, index) => {
              if (index === 0) {
                this.refs.boxPopup2.open();
              } else if (index === 1) {
                this.refs.boxPopup3.open();
              }
            }} />

            <PlanPopup ref="boxPopup1" style={{
              width: '367px',
              left: '100%',
              top: '-10px',
              marginLeft: '10px'
            }} title="Social : Why should you use it?">
              <PopupTextContent>
                <p>
                  Are we human because of unique traits and attributes not shared with either animal or machine? The definition of “human” is circular: we are human by virtue of the properties that make us hu<br />
                  man (i.e., distinct from animal and machine). It is a definition by negation: that which separates us
                </p>
              </PopupTextContent>
            </PlanPopup>

            <PlanPopup ref="boxPopup2" style={{
              width: '350px',
              left: '100%',
              top: '-10px',
              marginLeft: '10px'
            }} title="Social → Twitter: What is it?">
              <PopupTextContent>
                <p>
                  The preservation of human life is the ultimate value, a pillar of ethics and the foundation of all morality. This held true in most cultures and societies throughout history.<br />
                  On first impression, the last sentence sounds patently wrong. We all know about human collectives that regarded human lives as dispensable, that murdered and tortured, that cleansed and annihilated whole populations in recurrent genocides. Surely, these defy the aforementioned statement?
                </p>
              </PopupTextContent>
            </PlanPopup>

            <PlanPopup ref="boxPopup3" style={{
              width: '350px',
              left: '100%',
              top: '-10px',
              marginLeft: '10px'
            }} title="Social → Twitter: Expectation">
              <div className={ this.classes.popupRow }>
                <div data-icon="plan:twitter" className={ this.classes.popupRowIcon } />
                <div className={ this.classes.popupRowText }>
                  Twitter
                </div>

                <div className={ this.classes.popupRowRight }>
                  <div className={ this.classes.popupRowStatus }>
                    +23% (1820)
                  </div>
                </div>
              </div>
              <div className={ this.classes.popupRow }>
                <div data-icon="plan:download" className={ this.classes.popupRowIcon } />
                <div className={ this.classes.popupRowText }>
                  Downloads
                </div>

                <div className={ this.classes.popupRowRight }>
                  <div className={ this.classes.popupRowStatus }>
                    +8% (1250)
                  </div>
                </div>
              </div>
            </PlanPopup>
          </Box>
          <Box className={ this.classes.box } title="Advertising" price="$11,400" progress={ 46 }>
            <BoxLeveledRow>
              <BoxLevel icon="plan:magazine_black" title="Magazine" price="$2,000" disabled>
                <BoxLevel icon="plan:padnote_black" title="Consumer" price="$2,000" disabled>
                  <BoxLevel icon="plan:padnote_white" title="International" price="$2,000"></BoxLevel>
                </BoxLevel>
              </BoxLevel>
            </BoxLeveledRow>
            <BoxLeveledRow>
              <BoxLevel icon="plan:search_black" title="Search" price="$6,400" disabled>
                <BoxLevel icon="plan:google_white" title="Google Adwards" price="$4,800"></BoxLevel>
                <BoxLevel icon="plan:padnote_white" title="Others" price="$1,600"></BoxLevel>
              </BoxLevel>
            </BoxLeveledRow>
            <BoxRow icon="plan:facebook" title="Facebook Ads" price="$1,000" />
            <BoxRow icon="plan:youtube" title="Youtube Ads" price="$1,000" />
            <BoxRow icon="plan:twitter" title="Twitter Ads" price="$1,000" />
          </Box>
          <Box className={ this.classes.box } title="Affiliate program" price="$2,400" progress={ 10 }>
            <BoxRow icon="plan:affiliate" title="Affiliate program" price="$2,400" />
          </Box>
          <Box className={ this.classes.box } title="PR" price="$6,800" progress={ 28 }>
            <BoxRow icon="plan:pr" title="PR" price="$6,800" />
          </Box>
          <Box className={ this.classes.box } title="User Campaign" price="$2,000" progress={ 8 }>
            <BoxRow icon="plan:browser" link="" title="Web Summit" price="$2,000" />
          </Box>
        </Masonry>
      </div>

      <Explanation title="Explanation" text="Your strategy was built based on 89 experts and statistical analysis of 23 similar companies.
The 2 main fields (channels) that are recommended to you in the current month are: Advertising and Public Relations. 81% of similar companies to yours are using Advertising as the main channel in their strategy in we thought that you should too. In contrary, only 22% of these companies are using Public Relations as one of the main channels. But in your case, we thought that this channel would be a perfect fit to your marketing mix due to the fact that your main goal is getting as much awareness as possible." />

      { this.state.loadingExists ?

      <div className={ this.classes.loading }>
        <Popup className={ this.classes.popup }>
          <div>
            <Loading />
          </div>

          <div className={ this.classes.popupText }>
            Please wait while the system creates your plan
          </div>
        </Popup>
      </div>

      : null }
    </div>
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.timeout = setTimeout(() => {
        this.timeout = null;

        this.setState({
          loadingExists: false
        });
      }, 200);

      this.setState({
        loading: false
      });
    }, 2000);
  }
}