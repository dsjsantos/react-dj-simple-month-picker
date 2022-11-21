import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// Import module styles
import './styles.css';


const TODAY = new Date();
const ESCAPE_KEYCODE = 27;
const MONTH_NAME = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Ouc', 'Nov', 'Dec'];


const buildMonthKey = ({ year, month }) => {
    return `${`000${year}`.slice(-4)}${`0${month}`.slice(-2)}`;
}

const getThisMonth = () => {
    return { year: TODAY.getFullYear(), month: (TODAY.getMonth()+1) };
}

const inArray = (needle, haystack) => {
    if(isArray(haystack)) {
        for(var i=0; i<haystack.length; i++) {
            if(haystack[i] === needle) {
                return true;
            }
        }
    }
    return false;
}

const isArray = (obj) => {
    return obj && obj.constructor===Array;
}

const isInteger = (value) => {
    return Number.isInteger ? Number.isInteger(value) : (typeof value==="number" && Math.floor(value)===value);
}

const isValidMonthObject = (monthObj) => {
    const { year, month } = monthObj || {};
    return (isInteger(year) && isInteger(month) && year>=0 && year<=9999 && month>=1 && month<=12);
}

class PickerBox extends Component {
    constructor(props) {
        super(props);

        const { gridData } = props;
        const value = (props.value && props.value.constructor===Object) ? props.value : getThisMonth();               
        this.state = {
            visibleYear: gridData.initialYear,
            selectedMonth: value
        }
    }

    _getMonthContent = ({ year, month }) => {
        const { monthMask } = this.props;

        if(!isValidMonthObject({ year, month })) {
            return "ERR";
        }

        const padMonth = `0${month}`.slice(-2);
        if(!monthMask || (typeof monthMask!=="string") || !/^[^M]*M{0,4}[^M]*$/.test(monthMask) || !/^[^Y]*Y{1}[^Y]*$/.test(monthMask)) {
            return `${padMonth}/${year}`;
        }
        
        let content = monthMask;
        content = content.replace("Y", year);
        if(/^[^M]*MMMM[^M]*$/.test(content)) {
            content = content.replace("MMMM", this._getMonthName(month));
        } else if(/^[^M]*MMM[^M]*$/.test(content)) {
            content = content.replace("MMM", this._getMonthShortName(month));
        } else if(/^[^M]*MM[^M]*$/.test(content)) {
            content = content.replace("MM", padMonth);
        } else if(/^[^M]*M[^M]*$/.test(content)) {
            content = content.replace("M", month);
        }

        return content;
    }

    _getMonthName = (month) => {
        const { months } = this.props.language || {};
        if(months && isArray(months.name) && months.name.length===12) {
            return months.name[month-1];
        } else {
            return MONTH_NAME[month-1];
        }
    }

    _getMonthShortName = (month) => {
        const { months } = this.props.language || {};
        if(months && isArray(months.shortName) && months.shortName.length===12) {
            return months.shortName[month-1];
        } else {
            return MONTH_SHORT[month-1];
        }
    }

    _handleChangeYear = (e, step) => {
        e.stopPropagation();
        
        const { minYear, maxYear } = this.props.gridData;
        let newYear = Math.max(minYear, Math.min(maxYear, this.state.visibleYear+step));
        this.setState({
            visibleYear: newYear
        });
    }

    _handleMonthClick = (e, { year, month }) => {
        e.stopPropagation();
        
        const newMonth = { year, month };
        this.setState({
            setSelectedMonth: newMonth
        });
        this.props.onSelect(newMonth);

        const { selectedMonth } = this.state;
        const changed = newMonth.year!==selectedMonth.year || newMonth.month!==selectedMonth.month;
        if(changed) {
            this.props.onChange(newMonth);
        }
    }

    _ignoreClick = (e) => {
        e.stopPropagation();
    }

    _isMonthEnabled = (monthObj) => {
        const { validMonhts, invalidMonhts } = this.props.gridData;
        const monthKey = buildMonthKey(monthObj);

        if(isArray(validMonhts)) {
            return inArray(monthKey, validMonhts);
        }
        if(isArray(invalidMonhts)) {
            return !inArray(monthKey, invalidMonhts);
        }
    }

    render() {
        const { onlyPickerBox, gridData, visible, theme } = this.props;
        const { visibleYear } = this.state;
        const themeClass = `theme-${theme.toLowerCase()==="dark" ? "dark" : "light"}`;
        const rows = Array.apply(null, { length: 3}).map(Number.call, Number);
        const cols = Array.from({ length: 4}, (_, indx) => indx + 1);
        const mayGoBack = visibleYear>gridData.minYear;
        const mayGoForward = visibleYear<gridData.maxYear;
    
        return(
            <div 
                id="_simpleMonthPickerId_"
                className={`_smp-box_ ${themeClass}${!visible ? " _smp-not-visible_" : ""}${onlyPickerBox ? " static" : ""}`}
            >
                <div className="_year-row_">
                    <div className="_year-item-wrapper_">
                        <div className={`_button-box_${mayGoBack ? " clickable" : " disabled"}`}>
                            <div onClick={mayGoBack ? e => this._handleChangeYear(e, -1) : e => this._ignoreClick(e)}>
                                {"<"}
                            </div>
                        </div>
                        <div className="_info-box_">
                            <div onClick={e => this._ignoreClick(e)}>{visibleYear}</div>
                        </div>
                        <div className={`_button-box_${mayGoForward ? " clickable" : " disabled"}`}>
                            <div onClick={mayGoForward ? e => this._handleChangeYear(e, 1) : e => this._ignoreClick(e)}>
                                {">"}
                            </div>
                        </div>
                    </div>
                </div>

                { rows.map(row => {
                    return(
                        <div key={`row_${row}`} className="_month-row_">
                            { cols.map(col => {
                                const monthObj = { year: visibleYear, month: ((4*row) + col) };
                                const monthEnabled = this._isMonthEnabled(monthObj);
                                return(
                                    <div
                                        key={`item_${row}-${col}`} 
                                        className="_month-item-wrapper_" 
                                        onClick={monthEnabled ? e => this._handleMonthClick(e, monthObj) : e => this._ignoreClick(e)}
                                    >
                                        <div className={`_month-item-box_${monthEnabled ? " clickable" : " disabled"}`}>
                                            {this._getMonthContent(monthObj)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }
}

class SimpleMonthPicker extends Component {
    constructor(props) {
        super(props);

        this.state = { }
    }

    _buildGridData = () => {
        const period = this.props.period || {};
        const { monthList } = period;
        const thisYear = TODAY.getFullYear();
        let minYear = thisYear;
        let maxYear = thisYear;
        let validMonhts = null;
        let invalidMonhts = null;

        if(monthList && isArray(monthList) && monthList.length) {
            validMonhts = [];
            monthList.forEach(monthObj => {
                if(isValidMonthObject(monthObj)) {
                    if(monthObj.year < minYear) {
                        minYear = monthObj.year;
                    } else if(monthObj.year > maxYear) {
                        maxYear = monthObj.year;
                    }
                    validMonhts.push(buildMonthKey(monthObj));
                }
            });
        } else  {
            const { min, max, removeList } = period;
            minYear = (isInteger(min) && min>=0 && min<=9999) ? min : thisYear-5;
            maxYear = (isInteger(max) && max>=0 && max<=9999) ? max : thisYear+5;
            maxYear = Math.max(maxYear, minYear);
            invalidMonhts = [];
            if(isArray(removeList)) {
                removeList.forEach(monthObj => {
                    if(isValidMonthObject(monthObj)) {
                        invalidMonhts.push(buildMonthKey(monthObj));
                    }
                });
            }
        }
        let initialYear = isInteger(period.initialYear) ? period.initialYear : TODAY.getFullYear();
        initialYear = Math.min(maxYear, Math.max(minYear, initialYear));

        return ({ 
            minYear, 
            maxYear, 
            initialYear,
            validMonhts, 
            invalidMonhts 
        });
    }

    _handleKeyDown = (e) => {
        if(this.props.dismissOnEsc) {
            switch( e.keyCode ) {
                case ESCAPE_KEYCODE:
                    this._handlePickerDismiss(e);
                    break;
                default: 
                    break;
            }
        }
    }

    _handlePickerDismiss = (e) => {
        e.stopPropagation();
        if(this.props.onDismiss) {
            this.props.onDismiss();
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this._handleKeyDown, true);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown, true);
    }

    render() {
        const { onlyPickerBox, visible } = this.props;
        const pickerProps = {...this.props};
        pickerProps.gridData = this._buildGridData();
        pickerProps.onDismiss = this._handlePickerDismiss;

        return(
            <Fragment>
                { onlyPickerBox ?
                <PickerBox {...pickerProps} />
                :
                <div id="_smpFrameWrapperId_" className={`_smp-frame-wrapper_${!visible ? " _smp-not-visible_" : ""}`}>
                    <div className="_smp-frame_" onClick={(e) => this._handlePickerDismiss(e)}>

                        <PickerBox {...pickerProps} />

                    </div>
                </div>
                }
            </Fragment>
        )
    }

}

export default SimpleMonthPicker;

SimpleMonthPicker.propTypes = {
    value: PropTypes.object,
    visible: PropTypes.bool,
    dismissOnEsc: PropTypes.bool,
    onlyPickerBox: PropTypes.bool,
    theme: PropTypes.string,
    language: PropTypes.object,
    monthMask: PropTypes.string,
    period: PropTypes.object,
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    onDismiss: PropTypes.func.isRequired,
};
  
SimpleMonthPicker.defaultProps = {
    value: getThisMonth(),
    visible: true,
    dismissOnEsc: true,
    onlyPickerBox: false,
    theme: "light",
    language: null,
    monthMask: null,
    period: {},
    onChange: () => {},
    onSelect: () => {}
};
