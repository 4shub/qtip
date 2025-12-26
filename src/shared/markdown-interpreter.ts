import Showdown from 'showdown';

const showdown = new Showdown.Converter({ metadata: true });

showdown.setFlavor('github');

export default showdown;
