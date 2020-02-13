import React from 'react'
import ShallowRenderer from 'react-test-renderer/shallow'
import Message from './Message'

const renderer = new ShallowRenderer();

it('renders correctly', () => {
    const message = ['This is my message', 'It is about nothing', 'But it has three lines'];
    renderer.render(<Message message={message} />)
    const tree = renderer.getRenderOutput()
    expect(tree).toMatchSnapshot()
});
