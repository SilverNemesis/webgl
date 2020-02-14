import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import Credits from './Credits'

const renderer = new ShallowRenderer();

it('renders correctly', () => {
    const showCredits = true;
    renderer.render(<Credits show={showCredits} credits={['These are credits', 'Stuff from guy', 'More stuff from other guy']} />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
});
