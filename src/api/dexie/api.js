import { Dexie } from 'dexie'
class Database extends Dexie {
  constructor() {
    super('iwara');
    this.version('1.0').stores({
      iwara_info: '++id,dirname,play_url,title,producer,categories,upload_time,love,views,description,is_down',
      iwara_user: '++id,&username,password',
      iwara_love: '++id,iwara_info_id,love_level,user_id',
      iwara_collection_list: '++id,name,iwara_user_id',
      iwara_collection_list_item: '++id,iwara_info_id,iwara_collection_list_id,iwara_user_id',
    });

    this.iwara_info = this.table('iwara_info');
    this.iwara_love = this.table('iwara_love');
    this.iwara_user = this.table('iwara_user');
    this.iwara_collection_list_item = this.table('iwara_collection_list_item');
    this.iwara_collection_list = this.table('iwara_collection_list');

  }

  // 更新同步后的数据
  async syncData (data) {
    return await this.iwara_info.bulkPut(data)
  }
  //获取分页列表数据
  // async getSinglePageData (orderBy = 'id', page = 1, pageSize = 36, direction = 'reverse') {
  //   let total = 0;
  //   let list = [];
  //   if (direction != 'reverse') {
  //     total = await this.iwara_info.count()
  //     list = await this.iwara_info.orderBy(orderBy).offset((page - 1) * pageSize).limit(pageSize).toArray()
  //   } else {
  //     total = await this.iwara_info.count()
  //     list = await this.iwara_info.orderBy(orderBy).offset((page - 1) * pageSize).limit(pageSize).reverse().toArray()
  //   }
  //   return { total, list }
  // }
  async getSinglePageData (data) {
    const { orderBy, page, pageSize, direction, searchKeyword = '' } = data
    console.log(data);
    console.log(orderBy);
    let total = 0;
    let list = [];
    if (direction != 'reverse') {
      total = await this.iwara_info.filter(item => {
        const titleFlag = item.title.indexOf(searchKeyword) != -1
        const producer = item.producer.indexOf(searchKeyword) != -1
        const tagFlag = item.categories.indexOf(searchKeyword) != -1
        return titleFlag || producer || tagFlag
      }).count()
      list = await this.iwara_info.filter(item => {
        const titleFlag = item.title.indexOf(searchKeyword) != -1
        const producer = item.producer.indexOf(searchKeyword) != -1
        const tagFlag = item.categories.indexOf(searchKeyword) != -1
        return titleFlag || producer || tagFlag
      }).offset((page - 1) * pageSize).limit(pageSize).toArray()
    } else {
      total = await this.iwara_info.filter(item => {
        const titleFlag = item.title.indexOf(searchKeyword) != -1
        const producer = item.producer.indexOf(searchKeyword) != -1
        const tagFlag = item.categories.indexOf(searchKeyword) != -1
        return titleFlag || producer || tagFlag
      }).count()
      list = await this.iwara_info.filter(item => {
        const titleFlag = item.title.indexOf(searchKeyword) != -1
        const producer = item.producer.indexOf(searchKeyword) != -1
        const tagFlag = item.categories.indexOf(searchKeyword) != -1
        return titleFlag || producer || tagFlag
      }).offset((page - 1) * pageSize).limit(pageSize).reverse().toArray()
    }
    return { total, list }
  }
  //添加到喜爱
  async addToLove (data) {
    const { iwara_info_id, user_id, love_level } = data
    const i = await this.iwara_love.filter(item => {
      const flag1 = item.iwara_info_id == iwara_info_id
      const flag2 = item.user_id == user_id
      return flag1 && flag2
    }).toArray()
    if (i.length == 1) {
      let params = { user_id, iwara_info_id, love_level, id: i[0].id }
      return await this.iwara_love.put(params)
    } else {
      return await this.iwara_love.add(data)
    }
  }
  // 获取喜爱状态
  async getLoveStatus (data) {
    const { user_id, iwara_info_id } = data
    return await this.iwara_love.filter(res => {
      return res.user_id == user_id && res.iwara_info_id == iwara_info_id
    }).toArray()
  }
  //新建收藏列表
  async addCollectionList (data) {
    return await this.iwara_collection_list.add(data)
  }
  // 添加收藏
  async addCollection (data) {
    // const { iwara_info_id, iwara_collection_list_id, iwara_user_id } = data
    const res1 = await this.iwara_collection_list_item.where(data).toArray()
    console.log(res1);
    if (res1.length < 1) {
      return await this.iwara_collection_list_item.add(data)
    } else {
      return false
    }
  }
  // 删除收藏
  async deleteCollection (data) {
    // const { iwara_info_id, iwara_collection_list_id, iwara_user_id } = data

    return await this.iwara_collection_list_item.where(data).delete()
    // return await this.iwara_collection_list_item.modify(function (item) {
    //   if (item.iwara_user_id == iwara_user_id
    //     && item.iwara_info == iwara_info_id
    //     && item.iwara_collection_list_id == iwara_collection_list_id) {
    //     delete this.value
    //   } else return false
    // });
  }
  // 获取收藏列表
  async getCollectionList (iwara_user_id) {
    console.log('iwara_user_id', iwara_user_id);
    return await this.iwara_collection_list.where('iwara_user_id').equals(iwara_user_id).toArray()
  }
  //获取当前视频收藏状态
  async getCurCollectionStatus (data) {
    // const { iwara_info_id, iwara_user_id } = data
    return await this.iwara_collection_list_item.where(data).toArray()
  }
  //获取当前视频作者的作品列表
  async getCurVideoProducerProductionList (data) {
    const { producer } = data
    return await this.iwara_info.where('producer').equals(producer).reverse().limit(20).toArray()
  }
  // 获取作者的作品列表
  async getProducerProductionList (page = 1, pageSize = 36, producer) {
    const total = await this.iwara_info.where('producer').equals(producer).count()
    const list = await this.iwara_info.where('producer').equals(producer).offset((page - 1) * pageSize).limit(pageSize).reverse().toArray()
    return { total, list }
  }

  //获取喜爱的列表数据
  async getLoveSinglePageData (data) {
    const { love_level, user_id, page, pageSize } = data
    const loveList = await this.iwara_love.filter(item => {
      const loveLevelFlag = item.love_level == love_level
      const userIddFlag = item.user_id == user_id
      return loveLevelFlag && userIddFlag
    }).toArray()

    const list =
      await this.iwara_info.filter(item => {
        let flag = false;
        loveList.forEach(item2 => {
          if (item2.iwara_info_id == item.id) {
            flag = true
          }
        })
        return flag

      }).reverse().offset((page - 1) * pageSize).limit(pageSize).toArray()

    let total = await this.iwara_info.filter(item => {
      let flag = false;
      loveList.forEach(item2 => {
        if (item2.iwara_info_id == item.id) {
          flag = true
        }
      })
      return flag
    }).count()
    return { list, total }
  }

  //获得收藏列表数据
  async getCollectionListSinglePage (data) {
    const { iwara_collection_list_id, iwara_user_id, page, pageSize } = data
    console.log(iwara_collection_list_id, iwara_user_id, page, pageSize);
    const collectionList = await this.iwara_collection_list_item.filter(item => {
      const collectionFlag = item.iwara_collection_list_id == iwara_collection_list_id
      const userIddFlag = item.iwara_user_id == iwara_user_id
      return collectionFlag && userIddFlag
    }).toArray()
    console.log(collectionList);
    const list =
      await this.iwara_info.filter(item => {
        let flag = false;
        collectionList.forEach(item2 => {
          if (item2.iwara_info_id == item.id) {
            flag = true
          }
        })
        return flag

      }).reverse().offset((page - 1) * pageSize).limit(pageSize).toArray()

    let total = await this.iwara_info.filter(item => {
      let flag = false;
      collectionList.forEach(item2 => {
        if (item2.iwara_info_id == item.id) {
          flag = true
        }
      })
      return flag
    }).count()
    console.log(list);
    return { list, total }
  }

  //删除收藏列表
  async deleteCollectionList (data) {
    const { id } = data
    await this.iwara_collection_list.where('id').equals(id).delete()
    await this.iwara_collection_list_item.where('iwara_collection_list_id').equals(id).delete()
  }



  //===============================++++++++++++++++++++


}

export default new Database