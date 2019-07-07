import request from '@/utils/request'
const urlConfig = {
  log: '1001', //日志列表
  union: '1002', //单元列表
  animal: '1003',//动物列表
  animalEdit: '1004',//栏位（动物）数据修改
  constGet: '1005',//常量获取
  event: '1006',//事件列表获取
  eventAdd: '1007',//添加事件
  getFeed: '1008',//获取饲喂计划（天）
  fastInput: '1009',//快速输入
  constEdit: '1010',//常量修改
  feedDayEdit: '1011',//饲喂计划（天） 修改
  feedScGet: '1012',//获取饲喂计划（元数据）
  feedScEdit: '1013',//饲喂计划（元数据） 修改
  feedHourGet: '1014',//获取饲喂计划（小时）
  feedHourEdit: '1015',//饲喂计划（小时） 修改
  animalAdd: '1016',//添加动物
  userLogin: '1017', //登录
  userlist:'1018',//用户列表
  userAdd:'1019',//添加用户
  userPwdReset:'1020',//重置密码为初始值
  userDel:'1021',//删除用户
  userPwdChange:'1022',//修改密码
  getFeedList:'1023',//获取饲喂计划列表（元数据）
  calibration:'2001' ,// 校准
  feedRecord:'1024'
}

export function fast(url,param) {
    param = param?param:{}
    param['funcNo'] = urlConfig[url]
    var data = new URLSearchParams();
    for (var i in param) {
      data.append(i,param[i])
    }
    return request({
        url:'/EnterServlet',
        method: 'post',
        data: data
    })
}