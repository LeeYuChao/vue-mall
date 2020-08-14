import service from '@/utils/request';

export function TreeMenus(){
    return service.request({
        method: 'get',
        url: '/menu/treeMenus'
    })
  }