import React, { PropTypes } from 'react';
import Component from 'components/Component';
import style from 'styles/controls/floating-component.css';


const LeftTabCountour = () => (
    <svg version="1.1" style={{left: '1px'}} id="left-contour" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="29px" viewBox="0 0 24 29" enableBackground="new 0 0 24 29" xmlSpace="preserve">
        <path fill="#FFFFFF" d="M24,0v29H0c4.34-1.34,7.17-2.67,8.5-4s2.991-3.896,3.5-8c0.154-1.24,0.026-3.75,0-5 C11.864,5.371,17.37,0,24,0z"/>
    </svg>
);

const RightTabCountour = () => (
    <svg version="1.1" style={{right: '1px'}} id="right-countour" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
        width="24px" height="29px" viewBox="0 0 24 29" enableBackground="new 0 0 24 29" xmlSpace="preserve">
        <path fill="#FFFFFF" d="M24,29H0V0c6.63,0,12,5.37,12,12c0,0-0.154,3.76,0,5c0.509,4.104,2.17,6.67,3.5,8S19.66,27.66,24,29z"/>
    </svg>
);

/**
 * Wraps your component in a controlable floating element
 *
 * @typedef {object} Props
 * @prop {string} hiddenText Text that will appear when component is not active
 * @prop {string} shownText Text that will appear when component is active
 * @prop {object} style
 * @prop {string} className
 * @prop {boolean} isLast Is the child component at the end of the scroll range?
 * @prop {number} breakpoint Screen width when there's no menu appearing
 * @prop {boolean} popup Is the component in a popup?
 * @prop {string} popupClassname Partial match of the popup element class name
 * @extends {React.Component<Props>}
 */
export default class FloatingComponent extends Component {
    style = style;


    static defaultProps = {
        hiddenText: 'hide',
        shownText: 'show',
        style: {},
        className: '',
        /** If child component is not at the end
         *  of the page set this to false */
        isLast: true,
        /** Below this window width left position will not be calculate
         * essentially a resolution where the left menu is not shown anymore
         */
        breakpoint: 560,
        popup: false,
        popupClassname: 'popup'
    }

    static propTypes = {
        hiddenText: PropTypes.string,
        shownText: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        isLast: PropTypes.bool,
        breakpoint: PropTypes.number,
        popup: PropTypes.bool,
        popupClassname: PropTypes.string
    }

    state = {
        isActive: false,
        isControlInView: false,
        windowWidth: null,
        isCalculatePadding: false,
        scrollElement: null
    }

    componentDidMount() {
        const childElBox = this.childWrapperEl
        .children[0].getBoundingClientRect();

        window.component = this;

        // Needed for animating the height of the component
        window.addEventListener('animationend', this.handleAnimationEnd);
        window.addEventListener('animationstart', this.handleAnimationStart);


        // Update on resize state windowWidth on resize
        // Used to determine alignment for child component
        window.addEventListener('resize', this.handleResize);
       
        document.addEventListener('scroll', this.handleScroll);        

        this.updateInactiveChild();

        // Set initial window width
        this.setState({ windowWidth: window.innerWidth });
    }

    componentDidUpdate(prevProps, prevState) {
        // When the popup prows changes it will trigger update
        const scrollElement = this.getScrollParent(this.outerEl, this.props.popupClassname);
        if (scrollElement && !this.state.scrollElement) {
                this.setState({ scrollElement });
        }

        if (this.props.popup !== prevProps.popup) {
            this.deactivateAndRecalculate();
        }

        if (this.props.popup && this.props.popup !== prevProps.popup) {
            this.state.scrollElement.addEventListener('scroll', this.handleScroll);
            document.removeEventListener('scroll', this.handleScroll);
        }

        
        if (!this.props.popup && this.props.popup !== prevProps.popup) {
            this.state.scrollElement.removeEventListener('scroll', this.handleScroll);
            document.addEventListener('scroll', this.handleScroll);
        }
    }
    
    componentWillUnmount() {
        window.removeEventListener('animationend', this.handleAnimationEnd);
        window.removeEventListener('animationstart', this.handleAnimationStart);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * Gets a first upward element that is scrollable
     * 
     * @param {HTMLElement} node Starting element
     * @param {string} className Partial match of the popup className
     * @returns {(HTMLElement|null)}First upward scrolling element
     */
    getScrollParent = (node, className) => {
        if (node == null) {
            return null;
        }

        if (node.scrollHeight > node.clientHeight && node.className.indexOf('popup') !== -1) {
            return node;
        } else {
            return this.getScrollParent(node.parentNode);
        }
    }

    toggleActive = () => {
        this.updateInactiveChild();
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
            const childBoundingBox = childEl.getBoundingClientRect();
            this.inactiveLeftPosition = childBoundingBox.left;
            this.inactiveChildWidth = childBoundingBox.width;

        });
        triggerScroll();
    }

    updateInactiveChild = () => {
        if (this.state.isActive) {
            return;
        }

        const childEl = this.childWrapperEl.children[0];
        const childBoundingBox = childEl.getBoundingClientRect();
        this.inactiveLeftPosition = childBoundingBox.left;
        this.inactiveChildWidth = childBoundingBox.width;
    }

    handleAnimationEnd = (ev) => {
        if (ev.animationName.indexOf('expand') !== -1) {
            this.setState({ isCalculatePadding: true });
            triggerScroll();
        }

        if (ev.animationName.indexOf('contract') !== -1) {
            this.setState({ isCalculatePadding: false });
            triggerScroll();
        }

        this.updateInactiveChild();
    }

    handleAnimationStart = (ev) => {
        if (ev.animationName.indexOf('expand') !== -1) {
            this.setState({ isCalculatePadding: true });
            triggerScroll();
        }
    }

    handleScroll = (ev) => {
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
        // Do this so we can recalculate the alignment
        this.deactivateAndRecalculate();
        
        this.setState({ windowWidth: window.innerWidth });
    }

    getStyles = () => {
        // Merge default styles with style from props (use it also when flaoting is inactive)
        const mergedStyle = Object.assign({}, FloatingComponent.defaultProps.style, this.props.style);

        // We use style when floating is active
        let outerStyle = this.state.isActive ? mergedStyle : {};

        // Determine padding which we use to align the child component
        let childPaddingLeft = 0;
        if (
            this.state.isCalculatePadding &&
            this.state.windowWidth < this.props.breakpoint &&
            this.childWrapperEl &&
            this.childWrapperEl.childElementCount
        ) {
            childPaddingLeft = this.inactiveLeftPosition - this.childWrapperEl.getBoundingClientRect().left;
            outerStyle.left = childPaddingLeft;
        }

        // Calculate left position of the outer component
        if (this.state.isCalculatePadding && this.state.windowWidth >= this.props.breakpoint) {
            outerStyle.left = this.inactiveLeftPosition;
        } else {
            outerStyle.left = 0;
        }

        // Case when is popup
        if (this.props.popup && this.state.isActive) {
            outerStyle = {
                width: `${this.inactiveChildWidth}px`,
                left: `${this.inactiveLeftPosition}px`,
            };
        }

        // Child wrapper style
        let childStyle = {};
        if (!this.state.isActive) {
            childStyle.height = 'auto';
        }

        if (!this.props.popup) {
            childStyle.paddingLeft = `${childPaddingLeft}px`;
        }

        return { outerStyle, childStyle };
    }


    render() {
        const controlText = this.state.isActive ? this.props.hiddenText : this.props.shownText;
        
        // Clone height, used to make scrolling possible past the floating component
        const cloneHeight = this.state.isActive && this.props.isLast ? `${this.outerEl.offsetHeight}px` : 0;

        // Child classes
        let childClasses = this.classes.child;
        if (this.state.isActive) {
            childClasses = `${childClasses} ${this.classes.isEnabled}`;
        } else if (!this.state.isActive && this.state.isCalculatePadding) {
            childClasses = `${childClasses} ${this.classes.isEnabledEnd}`;
        }

        // Component parent div classes
        let outerClasses = `${this.classes.floatingComponent} ${this.props.className}`;
        if (this.state.isActive || this.state.isCalculatePadding) {
            outerClasses = `${outerClasses} ${this.classes.isActive}`;
        }

        const { childStyle, outerStyle } = this.getStyles();

        return (
            <div className={outerClasses} ref={el => this.componentEl = el}>
                <div ref={el => this.outerEl = el} className={this.classes.outer} style={outerStyle}>
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
                            style={childStyle}
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
