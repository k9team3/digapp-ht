/**
* Main application routes
*/

'use strict';

var errors = require('./components/errors');
var config = require('./config/environment');
var path = require('path');
var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
});

module.exports = function(app) {

    app.get('/config/?', function(req, res) {
        res.status(200).send({
            elasticConfig: JSON.parse(config.elasticConfig),
            elasticIndex: config.elasticIndex,
            elasticTypes: config.elasticTypes,
            appVersion: config.appVersion,
            annotationIndex: config.annotationIndex,
            annotationType: config.annotationType,
            annotationRelevant: config.annotationRelevant,
            cacheConfig: JSON.parse(config.cacheConfig),
            cacheIndex: config.cacheIndex,
            username: req.headers.user ? req.headers.user : 'mockUser',
            filterStatesIndex: config.filterStatesIndex,
            filterStatesType: config.filterStatesType,
            logIndex: config.logIndex,
            logType: config.logType,
            userIndex: config.userIndex,
            userType: config.userType,
            imageServiceAuth: config.imageServiceAuth,
            imageServiceHost: config.imageServiceHost
        });
    });

    app.post('/upload', upload.array('file'), function(req, res) {
      res.status(200).send(req.files[0].buffer.toString());
    });

    app.post('/uploadImage', upload.array('file'), function(req, res) {
        res.status(200).send({mimeType: req.files[0].mimetype, base64: req.files[0].buffer.toString('base64')});
    });
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*').get(function(req, res) {
        res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
