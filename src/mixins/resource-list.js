

let resourceMixin = {
  data () {
    return {
      name: 'resourceMixin',
      pagination: {
        current: 1,
        defaultCurrent: 1,
        pageSize: 36,
        defaultPageSize: 36,
        pageSizeOptions: ['36', '72', '108', '144'],
        total: 1,
        hideOnSinglePage: true,
        showSizeChanger: true,
        showQuickJumper: true,
      },
      datalist: [],
      orderBy: 'id',
      direction: 'reverse',
    }
  },
  created () {
    this.getSinglePageData()
  },
  mounted () { },
  methods: {
    pageChange (page) {
      this.pagination.current = page
      this.getSinglePageData()
    },
    showSizeChange (current, size) {
      this.pagination.pageSize = size
      this.getSinglePageData()
    },

  }
};
export default resourceMixin;