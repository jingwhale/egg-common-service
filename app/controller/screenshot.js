'use strict';

const Controller = require('egg-cloud').Controller;

class ScreentshotController extends Controller {
    constructor(ctx) {
        super(ctx)

        this.UserLoginTransfer = {
          mobile: { type: 'string', required: true, allowEmpty: false },
          password: { type: 'string', required: true, allowEmpty: false }
        }
    }
  async screenshot() {
      const { ctx, service } = this
      // 校验参数
      // ctx.validate(this.UserLoginTransfer)
      // 组装参数
      const payload = ctx.request.body || {}
      // 调用 Service 进行业务处理
      const res = await service.screenshot.screenshot(payload)
      ctx.body = res;
       // 设置响应内容和响应状态码
    // ctx.helper.success({ctx, res})
  }
}

module.exports = ScreentshotController;
