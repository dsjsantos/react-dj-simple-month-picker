# React dj-simple-month-picker

Simple React Month-Picker component that renders a month selection box or band with responsive layout that support period and language configuration.

## Installation

npm install --save react-dj-simple-month-picker

## Online Demo

Coming soon.

## Styles

The style sheet is automatically included by the component. There is no need for extra import.

## Code example

#### Import component into your react project

```js
import SimpleMonthPicker from 'react-dj-simple-month-picker';
```

#### Code snippet for a component

```jsx
constructor(props, context) {
    super(props, context)
    this.state = {
        pickerVisible: false,
        selectedMonth: null
    }
}

handlePickerChange = ({ year, month }) => {
    console.log("Month selection changed >>> ", { year, month });
    this.setState({
        selectedMonth: month
    });
}

handlePickerSelect = ({ year, month }) => {
    console.log("Month selected >>> ", { year, month });
    this.setState({
        selectedMonth: month
    });
}

hideMonthPicker = () => {
    this.setState({
        pickerVisible: false
    });
}

showMonthPicker = () => {
    this.setState({
        pickerVisible: true
    });
}

render() {
    const { pickerVisible, selectedMonth } = this.state;
    const period = {
        min: 2018,
        max: 2045,
        initialYear: 2018
    };
    const language = {
        months: { 
            name: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
        }
    };

    return(
        <button 
            type="button"
            onClick={() => showMonthPicker()}
        >
            {selectedMonth ? selectedMonth : "Pick a month"}
        </button>

        <SimpleMonthPicker
            value={selectedMonth}
            visible={pickerVisible}
            dismissOnEsc={true}
            theme="dark"
            monthMask="MMMM/Y"
            period={period}
            language={language}
            onChange={this.handlePickerChange}
            onSelect={this.handlePickerSelect}
            onDismiss={this.hideMonthPicker}
        /> 
    )
}
```

## Properties

##### @value:
Optional object containing current selected value of the year and month . Default is the current month and year.
```js
{ year, month }
```

##### @visible (true|false):

Optional boolean, with true as default value, that indicate if the component is visible or not. 
You should be awarned that if this property where false value the component will be rendered vith a 'display: none' on its most external element. A non visible component stills handling the &lt;ESC&gt; key press event to trigger the dimiss event.


##### @dismissOnEsc (true|false):

Optional boolean, with true as default value, that indicate if the componente should handle the &lt;ESC&gt; key press to triggers a dismiss event. 

##### @onlyPickerBox (true|false):

Optional boolean, with false as default value, that indicate if the componente renders only the 'picker box' instead of a full window shadow with the 'picker box' on the bottom of the page. 


##### @theme ("light"|"dark"):

Optional theme setting for the componente. There are two options available ("light"/"dark"). The default is "light".

##### @monthMask:

This property allows you to format the month text.
You may use one month mask and/or a year mask plus separators like (-, /, space, ...)

> Month masks (must be in CAPS)
- MMMM - will be replace with Full month name
- MMM - will be replace with Full abreviated/short month name
- MM - will be replaced by the month value padded to two digits
- M - will be replaced by the month value

> Year mask (must be in CAPS)
- Y - will be replaced by the year

> Examples: "MMMM-Y" | "Y/MMM" | "M/Y" | ...

Is a ampty or invalid mask where provided the default mask "MM/Y" will be used.

##### @language

Optional object with languages texts. Thera are a month consiguration wich is also an object with the the possibility os two configurations: name and shortName. 

- name: an array with months names. Default is the english month name with the first letter capitalized.
- shortName: an array with months abreviated names. Default is the english month abreviation with the first letter capitalized.

> The arrays must have exactly 12 strings, one for each month, in order.

```js
{
    months: { 
        name: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
        shortName: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    }
}
```

##### @period

Optional perios configuration parameters. The available options are:

- monthList: Array with the list of all allowed months to be shown. Each array element must be a object with the properties year and month. 

    > If this property exists in the object all others will be ignored.

In the following example only the months from March/2021 to June/2021 will be selectable.

```js
{
    monthList: [
        { year: 2021, month: 3 },
        { year: 2021, month: 4 },
        { year: 2021, month: 5 },
        { year: 2021, month: 6 }
    ],
}
```

- min: Minimum allowed year, the default is (current year - 5)
- max: Maximum allowed year, the default is (current year + 5)
- initialYear: The first year to be shown. Default is the current year.
- removeList: Similar to monthList it is a array of objects, each one with year and month properties. The values within this list will be disabled when displayed in the component.


```js
{
    min: 2010,
    max: 2030,
    initialYear: null,
    removeList: [],
}
```

##### @onChange:
Optional function to be called when there is a month selection change. The function will receive as parameter an object containing the new selected month and year.

```js
{ year, month }
```

##### @onSelect
Optional function to be called when a click on a valid month happens. The function will receive as parameter an object containing the selected month and year.

```js
{ year, month }
```

##### @onDismiss
Required function to be called when a dismiss event happens. This event is triggered in two ways:

- If @onlyPickerBox where false or ommited and the user clicks outside the picker area.
- If @dismissOnEsc where true or ommited and the user hits ESC key.


## Developing

Clone/fork the repository

```sh
npm install
npm run build
```

## Changelogs

#### v1.0.0 (March 21, 2021)
- First component release

## License

[Apache License v2.0](https://opensource.org/licenses/Apache-2.0)



### Enjoy-it
