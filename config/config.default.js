'use strict';

exports.rpc = {
  // registry: {
  //   address: '127.0.0.1:2181',
  // },
  // client: {},
  // server: {},
};

exports.security = {
  domainWhiteList: [ 'http://localhost:8000' ],
};

exports.cors = {
  origin: '*',
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
};