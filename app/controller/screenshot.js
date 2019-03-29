'use strict';

const Controller = require('egg').Controller;

class ScreentshotController extends Controller {
  constructor(ctx) {
      super(ctx)
      this.dataValidate = {
        appkey: { type: 'string', required: true, allowEmpty: false },
        url: { type: 'string', required: true, allowEmpty: false },
        isPart: { type: 'boolean', required: true, allowEmpty: false }
      }
  }
  async screenshot() {
      const { ctx, service } = this
      // 校验参数
      ctx.validate(this.dataValidate)
      // 组装参数
      const payload = ctx.request.body || {}

      // 调用 Service 进行业务处理
      const res = await service.screenshot.screenshot(payload)
      // ctx.body = res;
       // 设置响应内容和响应状态码
    ctx.helper.success({ctx, res})
  }
}

module.exports = ScreentshotController;
