import React, { PropTypes } from 'react';
import Component from 'components/Component';
import style from 'styles/controls/floating-component.css';


const LeftTabCountour = () => (
    <svg version="1.1" style={{left: '1px'}} id="left-contour" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="29px" viewBox="0 0 24 29" enableBackground="new 0 0 24 29" xmlSpace="preserve">
        <path fill="#FFFFFF" d="M24,0v29H0c4.34-1.34,7.17-2.67,8.5-4s2.991-3.896,3.5-8c0.154-1.24,0.026-3.75,0-5 C11.864,5.371,17.37,0,24,0z"/>
    </svg>
)

const RightTabCountour = () => (
    <svg version="1.1" style={{right: '1px'}} id="right-countour" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="24px" height="29px" viewBox="0 0 24 29" enableBackground="new 0 0 24 29" xmlSpace="preserve">
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
        isLast: true,
        breakpoint: 560
    }

    static propTypes = {
        hiddenText: PropTypes.string,
        shownText: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        isLast: PropTypes.bool,
        breakpoint: PropTypes.number
    }

    state = {
        isActive: false,
        isControlInView: false,
        windowWidth: null,
        
        /** 
         * Only two things interest us
         * height > 0 - child wrapper padding will be calculated
         * height === 0 - child wrapper padding will not be calculated
          */
        height: 0
    }

    componentDidMount() {
        const childEl = this.childWrapperEl.children[0];
        this.inactiveLeftPosition = childEl.getBoundingClientRect().left;

        // Needed for animating the height of the component
        window.addEventListener('animationend', this.handleAnimationEnd);
        window.addEventListener('animationstart', this.handleAnimationStart);


        // Update on resize state windowWidth on resize
        // Used to determine alignment for child component
        window.addEventListener('resize', this.handleResize);
       
        document.addEventListener('scroll', this.handleScroll);

        // Set initial window height
        this.setState({ windowWidth: window.innerWidth });
    }


    
    componentWillUnmount() {
        window.removeEventListener('animationend', this.handleAnimationEnd);
        window.removeEventListener('animationstart', this.handleAnimationStart);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('scroll', this.handleScroll);
    }

    toggleActive = () => {
        // Update inactiveLeftPosition on toggle, when inactive->activa
        if (!this.state.isActive) {
            const childEl = this.childWrapperEl.children[0];
            this.inactiveLeftPosition = childEl.getBoundingClientRect().left;
        }

        this.setState({
            isActive: !this.state.isActive,
            isControlInView: false
        });
        triggerScroll();
    }

    deactivateAndRecalculate = () => {
        this.setState({
            isActive: false,
            isControlInView: false
        }, () => {
            const childEl = this.childWrapperEl.children[0];
            this.inactiveLeftPosition = childEl.getBoundingClientRect().left;
        });
        triggerScroll();
    }

    handleAnimationEnd = (ev) => {
        if (!this.outerEl) {
            return;
        }

        if (ev.animationName.indexOf('expand') !== -1) {
            this.setState({ height: 358 });
            triggerScroll();
        }

        if (ev.animationName.indexOf('contract') !== -1) {
            this.setState({ height: 0 });
            triggerScroll();
        }
    }

    handleAnimationStart = (ev) => {
        if (!this.outerEl) {
            return;
        }

        if (ev.animationName.indexOf('expand') !== -1) {
            this.setState({ height: 1 });
            triggerScroll();
        }
    }

    handleScroll = () => {
        if (!this.outerEl) {
            return;
        }

        const elementHeight = this.controlHandleEl.offsetHeight;
        const innerElementTop = this.innerEl.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (innerElementTop + elementHeight <  windowHeight) {
            this.setState({ isControlInView: true });
        } else if (innerElementTop >= windowHeight) {
            this.setState({ isControlInView: false });
        }
    }

    handleResize = () => {
        if (!this.outerEl) {
            return;
        }
        // Do this so we can recalculate the alignment
        this.deactivateAndRecalculate();
        
        this.setState({ windowWidth: window.innerWidth });
    }


    render() {
        const controlText = this.state.isActive ? this.props.hiddenText : this.props.shownText;

        // Merge default styles with style from props (use it also when flaoting is inactive)
        const mergedStyle = Object.assign({}, FloatingComponent.defaultProps.style, this.props.style);

        // We use style when floating is active
        let style = this.state.isActive ? mergedStyle : {};

        // Clone height, used to make scrolling possible past the floating component
        const cloneHeight = this.state.isActive && this.props.isLast ? `${this.outerEl.offsetHeight}px` : 0;

        // Determine padding which we use to align the child component
        let childPaddingLeft = 0;
        if (
            this.state.height > 0 &&
            this.state.windowWidth < this.props.breakpoint &&
            this.childWrapperEl &&
            this.childWrapperEl.childElementCount
        ) {
            childPaddingLeft = this.inactiveLeftPosition - this.childWrapperEl.getBoundingClientRect().left;
            style.left = childPaddingLeft;
        }

        // Calculate left position of the outer component
        if (this.state.height > 0 && this.state.windowWidth >= this.props.breakpoint) {
            style.left = this.inactiveLeftPosition;
        } else {
            style.left = 0;
        }

        // Child classes
        let childClasses = this.classes.child;
        if (this.state.isActive) {
            childClasses = `${childClasses} ${this.classes.isEnabled}`;
        } else if (!this.state.isActive && this.state.height > 0) {
            childClasses = `${childClasses} ${this.classes.isEnabledEnd}`;
        }

        // Component parent div classes
        let outerClasses = `${this.classes.floatingComponent} ${this.props.className}`;
        if (this.state.isActive) {
            outerClasses = `${outerClasses} ${this.classes.isActive}`;
        } else if (this.state.height > 0) {
            outerClasses = `${outerClasses} ${this.classes.isActive}`;
        }

        return (
            <div className={outerClasses}>
                <div ref={el => this.outerEl = el} className={this.classes.outer} style={style}>
                    <div
                        ref={el => this.controlHandleEl = el}
                        className={!this.state.isControlInView && !this.state.isActive? `${this.classes.control} ${this.classes.isNotInView}` : this.classes.control}
                        style={{left: `${this.inactiveLeftPosition}px`}}
                    >
                        <LeftTabCountour />
                        <div className={this.classes.controlHandle} onClick={this.toggleActive}>
                            <span className={this.classes.controlIconWrapper}>
                                <svg className={this.classes.controlIcon} xmlns="http://www.w3.org/2000/svg" width="7" height="4" viewBox="0 0 7 4">
                                    <path fill="#B2BBD5" fillRule="nonzero" d="M.703 0L0 .719l3.477 3.34L6.949.719 6.254 0 3.477 2.66z"/>
                                </svg>
                            </span>
                            <span className={this.classes.controlText}>{controlText}</span>
                        </div>
                        <RightTabCountour />
                    </div>
                    <div className={this.classes.inner} ref={el => this.innerEl = el}>
                        <div
                            ref={el => this.childWrapperEl = el}
                            className={childClasses}
                            style={{paddingLeft: childPaddingLeft}}
                        >
                            {this.props.children}
                        </div>
                    </div>
                </div>
                <div style={{ height: cloneHeight }} ref={el => this.cloneEl = el} className={this.classes.outerClone}/>
            </div>
        );
    }
}

const triggerScroll = () => {
    window.scrollTo(window.scrollX, window.scrollY - 1);
    window.scrollTo(window.scrollX, window.scrollY + 1);
}
