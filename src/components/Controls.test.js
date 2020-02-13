import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import Controls from './Controls'

const renderer = new ShallowRenderer();

it('renders correctly', () => {
    const showControls = true;
    const onClickPrevious = () => { };
    const onClickNext = () => { };
    const onChange = () => { };
    const options = [];
    renderer.render(<Controls show={showControls} onClickPrevious={onClickPrevious} onClickNext={onClickNext} onChange={onChange} options={options} />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
});
