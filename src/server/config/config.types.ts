export type ImportedSiteConfig = {
    head: string[];
    endOfBody: string[];
    favicon: string;
    logo: {
        text: string;
        link: string;
    };
};

export type SiteConfig = {
    head: string;
    endOfBody: string;
    favicon: string;
    logo: {
        text: string;
        link: string;
    };
};
