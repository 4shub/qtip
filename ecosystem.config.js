const qtip_server = {
    name: 'qtip-server',
    script: './dist',
    instances: 1,
};

module.exports = {
    apps: [
        qtip_server,
    ],
};
