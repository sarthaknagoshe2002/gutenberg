/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import initBlock from '../utils/init-block';
import { icon } from './icons';
import variations from './variations';

/* Block settings */
const { name } = metadata;
export { metadata, name };

export const settings = {
	icon,
	edit,
	variations,
};

export const init = () => initBlock( { name, metadata, settings } );
