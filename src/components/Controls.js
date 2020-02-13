import React from 'react';

const SelectControl = (props) => {
  function onChange(event) {
    props.onChange(control, event.target.value);
  }
  const { control } = props;
  const options = [];
  for (let i = 0; i < control.options.length; i++) {
    options.push(
      (<option key={i} value={i}>{control.options[i]}</option>)
    );
  }
  return (
    <div className="control">
      <label htmlFor={control.name}>{control.name}</label>
      <select id={control.name} className="select-css" value={control.value} onChange={onChange}>
        {options}
      </select>
    </div>
  );
}

const Controls = ({ show, onClickPrevious, onClickNext, onChange, options }) => {
  if (!show) {
    return null;
  }
  const controls = options.map((option, index) => {
    switch (option.type) {
      case 'select':
        return <SelectControl key={index} control={option} onChange={onChange} />
      default:
        return (
          <div>{option.type} is not supported</div>
        );
    }
  });
  return (
    <div id="overlay">
      <div className="none">
        <span className="left" onClick={onClickPrevious}>❮ PREV</span>
        <span className="right" onClick={onClickNext}>NEXT ❯</span>
      </div>
      <div>
        {controls}
      </div>
    </div>
  );
}

export default Controls;
