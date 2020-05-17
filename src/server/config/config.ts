import { getConfigFile } from './config.helpers';
import { DEFAULT_CONFIG, FALLBACK_CONFIG } from './config.constants';
import { ImportedSiteConfig, SiteConfig } from './config.types';

const getConfigDataFromFile = (): ImportedSiteConfig => {
    let config: string = '';

    try {
        config = getConfigFile(DEFAULT_CONFIG);
    } catch (e) {
        if (!e.message.includes('no such file or directory')) {
            throw e;
        }

        try {
            config = getConfigFile(FALLBACK_CONFIG);
        } catch (e) {
            throw `\nConfig does not exist, please create a file called qtip-config.json on the root directory and populate it similarly to the link below:\n
        `;
        }
    }

    try {
        return JSON.parse(config);
    } catch (e) {
        throw 'The JSON provided was not configured properly.';
    }
};

const buildConfig = (): SiteConfig => {
    const config = getConfigDataFromFile();

    return {
        headTags: config.headTags,
        favicon: config.favicon,
        logo: config.logo,
    };
};

export const config: SiteConfig = buildConfig();
