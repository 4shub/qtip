const qtip_server = {
    name: 'qtip-server',
    script: './dist/server',
    instances: 1,
};

module.exports = {
    apps: [
        qtip_server,
    ],
};
