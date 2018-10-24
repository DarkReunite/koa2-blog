import mdModel from '../../models/md';
import fs from 'fs';
import marked from 'marked';


class User {
  constructor(){
    this.pageSize = 1; //一页显示多少篇
    this.getSummary = this.getSummary.bind(this);
    this.getTotalPage = this.getTotalPage.bind(this);
  }

  async getSummary(ctx) {
    //获取前几条文章摘要并且返回给前端
    //1. 根据前端返回的页数来获取数据库存储的md文件路径
    //2. 读取md文件，并且使用正则表达式返回文章摘要及文章标签和分类
    let page = ctx.params.page;
    
    let skipPage = this.pageSize*(page - 1);

    
    try {
      let mdList = await mdModel.find().sort({'_id': -1}).skip(skipPage).limit(this.pageSize).exec();

      if (mdList.length === 0) {
        ctx.body = {
          status: 0,
          message: '文章列表为空'
        }
        return;
      }
      
      //匹配md文档中##之前的所有内容
      let summaryReg = /^#[^#]*/;

      //匹配h1内容的正则表达式
      let titleReg = /<h1[^>]*>([\w-\W]+)<\/h1>/;   


      let summaryList = [];
      
      mdList.forEach((value, index) => {
        let mdStr = fs.readFileSync(value.saveAt, 'utf-8');

        
        let content = marked(mdStr.match(summaryReg)[0]);

        
        let title = content.match(titleReg)[0];
      
        //去除标题之后的摘要
        content = content.replace(title,'');

        //去除标题的h1标签
        title = title.match(titleReg)[1];
        summaryList.push({
          _id: value._id,
          title,
          content,
          category: value.category,
          tags: value.tags,
          createdAt: value.createdAt
        })
      });

      

      ctx.body = summaryList;



    } catch (error) {
      console.log(error);
      ctx.body = {
        status: -1,
        message: '发生未知错误'
      }
    }
  }// end getSummary

  async getTotalPage(ctx) {
    //获取后台的文章数量，转换成总页数
    try {
      let mdList = await mdModel.find({});
      let Num = Object.keys(mdList).length;
      let totalPage = null;

      //将总的文章数量除以一页显示的文章数， 得到的结果向上取整即可
      totalPage = Math.ceil(Num/this.pageSize);
      ctx.body = totalPage;
      
    } catch (error) {

      console.log(error);
      ctx.body = {
        status: -1,
        message: '发生未知错误'
      }
    }
  }// end getTotalPage

  async getArticle(ctx){
    //返回文章的内容给前端
    let _id = ctx.params.id;
    try {
      let md = await mdModel.findById({_id});

      if (!md) {
        ctx.body = {
          status: 0,
          message: '该文章不存在'
        }
        
        return;
      }
      //1. 判断文章所存储的文件是否存在
      let mdStr = fs.readFileSync(md.saveAt, 'utf-8');

      if (!mdStr) {
        ctx.body = {
          status: 0,
          message: '该文件不存在'
        }
        return;
      }

      let content = marked(mdStr);

      //获取文章标题
      //匹配h1内容的正则表达式
      let titleReg = /<h1[^>]*>([\w-\W]+)<\/h1>/;   

      let title = content.match(titleReg)[0];
      
      //去除标题之后的摘要
      content = content.replace(title,'');

      //去除标题的h1标签
      title = title.match(titleReg)[1];

      let article = {
        title,
        content,
        _id: md._id,
        category: md.category,
        tags: md.tags,
        createdAt: md.createdAt,
        comment: md.comment
      }

      console.log(article);
      
      
      ctx.body = article;


    } catch (error) {
      
    }
  }
}

export default new User();