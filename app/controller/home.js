'use strict';

const Controller = require('egg-cloud').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = `hi, egg-RESTfulAPI!
    A optimized Node.js RESTful API Server Template based on egg.js.
    https://github.com/jingwhale/egg-common-service`
  }
}

module.exports = HomeController;
