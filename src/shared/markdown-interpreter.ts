import Showdown from 'showdown';

const showdown = new Showdown.Converter();

showdown.setFlavor('github');

export default showdown;
