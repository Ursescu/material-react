import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

class RippleController extends React.PureComponent {
    static propTypes = {
        rippleDuration: PropTypes.number
    }
    static defaultProps = {
        rippleDuration: 1000
    }
    static defaultRipple = {
        id: undefined,
        x: 0,
        y: 0,
        size: 0,
        focus: false,
        ending: false,
        finished: true,
        focusAnimationDuration: 1000,
        touchEndAnimationDuration: 1000,
        timeoutID: undefined,
    }
    constructor() {
        super();

        this.rippleCount = 0;
        this.ripples = {};
        this.rippleIDs = [];
        this.touches = {};

        this.startRippleAt = this.startRippleAt.bind(this);
        this.createRipple = this.createRipple.bind(this);
        this.findFreeRipple = this.findFreeRipple.bind(this);
        this.updateRipple = this.updateRipple.bind(this);
        this.endRippleAnimation = this.endRippleAnimation.bind(this);
        this.endRipple = this.endRipple.bind(this);

        this.onCursorDown = this.onCursorDown.bind(this);
        this.onCursorUp = this.onCursorUp.bind(this);
    }
    createRipple() {
        var id = this.rippleCount++;

        this.ripples[id] = Object.assign({}, RippleController.defaultRipple);
        this.ripples[id].id = id;

        this.rippleIDs.push(id);
        return this.ripples[id];
    }
    findFreeRipple() {
        for (var i = 0; i < this.rippleIDs.length; i++) {
            if (this.ripples[this.rippleIDs[i]].finished) {
                return this.ripples[this.rippleIDs[i]];
            }
        }
        return this.createRipple();
    }
    endRippleAnimation(ripple) {
        ripple.timeoutID = setTimeout(() => {
            ripple.timeoutID = undefined;
            ripple.ending = false;
            ripple.finished = true;
            this.forceUpdate();
        }, ripple.touchEndAnimationDuration);
    }
    updateRipple(newRipple, animationDuration) {
        // console.log('update', newRipple, animationDuration);
        var ripple = this.findFreeRipple();

        ripple.x = newRipple.x;
        ripple.y = newRipple.y;
        ripple.size = newRipple.size;
        ripple.focus = newRipple.focus;
        ripple.touchEndAnimationDuration = animationDuration >= 0 ? animationDuration : RippleController.defaultRipple.touchEndAnimationDuration;
        ripple.finished = false;
        ripple.ending = false;

        this.forceUpdate();

        if (!newRipple.focus) {
            this.endRippleAnimation(ripple);
        }
        return ripple;
    }
    startRippleAt(options) {
        var x = options.x - window.scrollX - options.size / 2 - options.rect.left;
        var y = options.y - window.scrollY - options.size / 2 - options.rect.top;

        var ripple = this.updateRipple({
            x: x,
            y: y,
            size: options.size,
            focus: options.focus
        });
        var touchID = options.touchID || 0;
        // if (this.touches[touchID]) {
        //     this.endRipple(touchID);
        // }
        this.touches[touchID] = ripple;
    }
    endRipple(touchID) {
        touchID = touchID || 0;
        var ripple = this.touches[touchID];
        if (ripple) {
            // ripple.focus = false;
            ripple.ending = true;

            this.forceUpdate();
            this.endRippleAnimation(ripple);
        }
    }
    onCursorDown(options) {
        this.startRippleAt(options);
    }
    onCursorUp(touchID) {
        this.endRipple(touchID);
    }
    render() {
        return (
            <span>
                {
                    this.rippleIDs.map((rippleID) => {
                        var ripple = this.ripples[rippleID];
                        console.log(JSON.stringify(ripple, null, 4));
                        var style = {
                            display: ripple.finished ? 'none' : 'block',
                            width: ripple.size,
                            height: ripple.size,
                            top: ripple.y,
                            left: ripple.x
                        };
                        var classes = 'ripple';
                        if (!ripple.finished) {
                            if (ripple.focus) {
                                classes = 'ripple focus';
                                style.animationDuration = ripple.focusAnimationDuration + 'ms';
                                if (ripple.ending) {
                                    classes = 'ripple ending';
                                    style.animationDuration = ripple.touchEndAnimationDuration + 'ms';
                                }
                            }
                            else {
                                style.animationDuration = ripple.touchEndAnimationDuration + 'ms';
                            }
                        }

                        return <b className={classes} style={style} key={rippleID} />;
                    })
                }
            </span>
        );
    }
}

export default RippleController;