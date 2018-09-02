import React, { PropTypes } from 'react';
import Component from 'components/Component';
import style from 'styles/controls/floating-component.css';


const LeftTabCountour = () => (
    <svg version="1.1" id="left-contour" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="29px" viewBox="0 0 24 29" enable-background="new 0 0 24 29" xmlSpace="preserve">
        <path fill="#FFFFFF" d="M24,0v29H0c4.34-1.34,7.17-2.67,8.5-4s2.991-3.896,3.5-8c0.154-1.24,0.026-3.75,0-5 C11.864,5.371,17.37,0,24,0z"/>
    </svg>
)

const RightTabCountour = () => (
    <svg version="1.1" id="right-countour" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="24px" height="29px" viewBox="0 0 24 29" enable-background="new 0 0 24 29" xmlSpace="preserve">
        <path fill="#FFFFFF" d="M24,29H0V0c6.63,0,12,5.37,12,12c0,0-0.154,3.76,0,5c0.509,4.104,2.17,6.67,3.5,8S19.66,27.66,24,29z"/>
    </svg>
);

/**
 * Wraps your component in a controlable
 * floating element
 *
 * @extends {React.Component}
 */
export default class FloatingComponent extends Component {
    style = style;


    static defaultProps = {
        hiddenText: 'hide',
        shownText: 'show',
        style: {},
        className: '',
        isLast: true
    }

    static propTypes = {
        hiddenText: PropTypes.string,
        shownText: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        isLast: PropTypes.bool
    }

    state = {
        isActive: false,
        isControlInView: false
    }

    toggleActive = () => {
        this.setState({
            isActive: !this.state.isActive,
            isControlInView: false
        });
        window.scrollTo(window.scrollX, window.scrollY - 1);
        window.scrollTo(window.scrollX, window.scrollY + 1);
    }

    componentDidMount() {
        document.addEventListener('scroll', () => {
            const elementHeight = this.controlHandleEl.offsetHeight;
            const innerElementTop = this.innerEl.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (innerElementTop + elementHeight <  windowHeight) {
                this.setState({ isControlInView: true });
            } else if (innerElementTop >= windowHeight) {
                this.setState({ isControlInView: false });
            }
        });
    }

    render() {
        const controlText = this.state.isActive ? this.props.hiddenText : this.props.shownText;

        // Merge default styles with style from props (use it also when flaoting is inactive)
        const mergedStyle = Object.assign({}, FloatingComponent.defaultProps.style, this.props.style);

        // We use style when floating is active
        const style = this.state.isActive ? mergedStyle : {};

        // Clone height, used to make scrolling possible past the floating component
        const cloneHeight = this.state.isActive && this.props.isLast ? `${this.outerEl.offsetHeight}px` : 0;

        return (
            <div
                className={`${this.classes.floatingComponent} ${this.props.className} ${this.state.isActive ? this.classes.isActive : ''}`}
            >
                <div ref={el => this.outerEl = el} className={this.classes.outer} style={style}>
                    <div
                        ref={el => this.controlHandleEl = el}
                        className={!this.state.isControlInView && !this.state.isActive? `${this.classes.control} ${this.classes.isNotInView}` : this.classes.control}
                    >
                        <LeftTabCountour />
                        <div className={this.classes.controlHandle} onClick={this.toggleActive}>
                            <span className={this.classes.controlIconWrapper}>
                                <svg className={this.classes.controlIcon} xmlns="http://www.w3.org/2000/svg" width="7" height="4" viewBox="0 0 7 4">
                                    <path fill="#B2BBD5" fill-rule="nonzero" d="M.703 0L0 .719l3.477 3.34L6.949.719 6.254 0 3.477 2.66z"/>
                                </svg>
                            </span>
                            <span className={this.classes.controlText}>{controlText}</span>
                        </div>
                        <RightTabCountour />
                    </div>
                    <div className={this.classes.inner} ref={el => this.innerEl = el}>
                        <div className={this.classes.child}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <div style={{ height: cloneHeight }} ref={el => this.cloneEl = el} className={this.classes.outerClone}/>
            </div>
        );
    }
}
