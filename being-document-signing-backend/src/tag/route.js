const Joi = require("@hapi/joi");
const Handlers = require('./handler');

module.exports = [
  {
    method: 'POST',
    path: '/tag/addOrUpdate',
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('userAuthToken:以Bearer 开头'),
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          tagName: Joi.string().max(16).required().description('标签名称'),
          tagId: Joi.number().description('标签id，非必填，如果填写了则代表更新标签，否则为新增'),
        })
      },
      handler: Handlers.addOrUpdateTag,
      response: {
        schema: Joi.object({
          code: Joi.number().description('200 for success, other fail'),
          message: Joi.string().description('text message for response'),
          data: Joi.object({
            id: Joi.number().description('tagId'),
            name: Joi.string().description('标签名称')
          })
        }).label('Result')
      },
      notes: '新增或更新标签',
      description: '新增或更新标签',
      tags: ['api', 'tag', 'add', 'update']
    }
  },
  {
    method: 'POST',
    path: '/tag/del',
    options: {
      validate: {
        payload: Joi.object({
          tagId: Joi.number().required().description('标签id')
        })
      },
      handler: Handlers.delTag,
      response: {
        schema: Joi.object({
          code: Joi.number().description('200 for success, other fail'),
          message: Joi.string().description('text message for response')
        }).label('Result')
      },
      notes: '删除标签',
      description: '删除标签',
      tags: ['api', 'tag', 'del']
    }
  },
  {
    method: 'GET',
    path: '/tag/list',
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('userAuthToken:以Bearer 开头'),
        }).options({
          allowUnknown: true
        }),
        query: Joi.object({
          start: Joi.number().description('分页参数start，非必填从0开始'),
          limit: Joi.number().description('分页参数limit，非必填默认20条'),
        })
      },
      handler: Handlers.getTagList,
      response: {
        schema: Joi.object({
          code: Joi.number().description('200 for success, other fail'),
          message: Joi.string().description('text message for response'),
          data: Joi.array().items(Joi.object({
            id: Joi.number().description('tagId'),
            name: Joi.string().description('标签名称'),
            status: Joi.number().allow(1, 2).description('标签状态: 1(可用)、2(已删除，不可用)'),
            createTime: Joi.date().timestamp().description('创建时间')
          }))
        }).label('Result')
      },
      notes: '获取标签列表',
      description: '获取标签',
      tags: ['api', 'tag', 'list']
    }
  },
  {
    method: 'POST',
    path: '/tag/detail/update',
    options: {
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required().description('userAuthToken:以Bearer 开头'),
        }).options({
          allowUnknown: true
        }),
        payload: Joi.object({
          tagIds: Joi.array().items(Joi.number().description('标签 id')).required().description('标签id列表，如果没有标签请传: []'),
          letterId: Joi.number().required().description('letterId'),
        })
      },
      handler: Handlers.detailUpdate,
      response: {
        schema: Joi.object({
          code: Joi.number().description('200 for success, other fail'),
          message: Joi.string().description('text message for response')
        }).label('Result')
      },
      notes: '更新标签',
      description: '签署详情更新标签',
      tags: ['api', 'tag', 'detail', 'update']
    }
  },
]