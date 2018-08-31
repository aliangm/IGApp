import React, { PropTypes } from 'react';
import Component from 'components/Component';
import style from 'styles/controls/floating-component.css';

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
        style: { left: '88px'},
        className: ''
    }

    static propTypes = {
        hiddenText: PropTypes.string,
        shownText: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string
    }

    state = {
        isActive: false
    }

    constructor(props) {
        super(props);
        const userStyle = this.props.style;
        console.log(userStyle);
        // this.style = 
    }

    toggleActive = () => {
        this.setState({ isActive: !this.state.isActive})
    }

    render() {
        const controlText = this.state.isActive ? this.props.hiddenText : this.props.shownText;

        // Merge default styles with style from props
        const mergedStyle = Object.assign({}, FloatingComponent.defaultProps.style, this.props.style); 
        const style = this.state.isActive ? mergedStyle : {};
        
        return (            
            <div
                className={`${this.classes.floatingComponent} ${this.props.className} ${this.state.isActive ? this.classes.isActive : ''}`}
            >   
                <div className={this.classes.outer} style={style}>
                    <div className={this.classes.control}>
                        <div className={this.classes.controlHandle} onClick={this.toggleActive}>
                            <span className={this.classes.controlIconWrapper}>
                                <svg className={this.classes.controlIcon} xmlns="http://www.w3.org/2000/svg" width="7" height="4" viewBox="0 0 7 4">
                                    <path fill="#B2BBD5" fill-rule="nonzero" d="M.703 0L0 .719l3.477 3.34L6.949.719 6.254 0 3.477 2.66z"/>
                                </svg>
                            </span>
                            <span className={this.classes.controlText}>{controlText}</span>
                        </div>
                    </div>
                    <div className={this.classes.inner}>
                        <div className={this.classes.child}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}