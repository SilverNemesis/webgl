import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import Controls from './Controls'

const renderer = new ShallowRenderer();

it('renders correctly', () => {
    const showControls = true;
    const onClickPrevious = () => { };
    const onClickNext = () => { };
    const onChange = () => { };
    const options = [
        {
            name: 'Select Test',
            type: 'select',
            options: ['gold', 'silver', 'platinum']
        },
        {
            name: 'Bool Test',
            id: 'boolTest',
            type: 'bool'
        },
        {
            name: 'Int test',
            id: 'intTest',
            type: 'int',
            min: 0,
            max: 32
        },
        {
            name: 'Float Test',
            id: 'floatTest',
            type: 'float',
            min: 0.0,
            max: 1.0
        },
        {
            name: 'Function Test',
            type: 'function',
            function: null
        }
    ];
    renderer.render(<Controls show={showControls} onClickPrevious={onClickPrevious} onClickNext={onClickNext} onChange={onChange} options={options} />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
});
