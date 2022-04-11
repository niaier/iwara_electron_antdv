import { Dexie } from 'dexie'

class Database extends Dexie {
  constructor() {
    super('iwara');
    this.version('1.0').stores({
      iwara_info: '++id,dirname,play_url,title,producer,categories,upload_time,love,views,description,is_down,is_loved,playlist',
      iwara_playlist: '++id',
      iwara_favorite: '++id'
    });

    this.iwara_info = this.table('iwara_info');
    this.iwara_playlist = this.table('iwara_playlist');
    this.iwara_favorite = this.table('iwara_favorite');
  }

  // 更新同步后的数据
  async syncData (data) {
    return await this.iwara_info.bulkPut(data)
  }
  //获取分页列表数据
  // async getSinglePageData (orderBy = 'id', page = 1, size = 36) {
  // }



  //===============================++++++++++++++++++++
  // 当前有关收藏
  async getCurCollection (url) {
    let curCollection = []
    curCollection = await this.collection.where('url').equals(url).toArray()
    return curCollection
  }
  // 添加收藏
  async addToCollection (data) {
    return await this.collection.add(data)
  }
  // 删除收藏
  async deleteCollection (id, url) {
    console.log(id, url);
    return await this.collection
      .where({ 'collection_list_id': id, url }).delete()
  }
  // 获取收藏列表
  async getCollectionList () {
    let collectionClassList = []
    collectionClassList = await this.collection_class_list.orderBy('id').toArray();
    return collectionClassList
  }
  // 添加收藏列表
  async addCollectionList (data) {
    return await this.collection_class_list.add(data)
  }


}

export default new Database