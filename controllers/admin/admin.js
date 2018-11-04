import mdModel from '../../models/md';
import fs from 'fs';

let articles_path = './articles/';

class Admin {
  constructor(){}


  async receiveFile(ctx) {
    // 获取前端传过来的文件
    //1. 查询数据库中是否存在相同的文件名
    //2. 不存在则移动到对应的文件夹中，并保存到数据库中
    //3. 存在则返回错误

    //文件对象
    let file = ctx.request.files.mdFile;
    //文件的创建时间
    let createdAt = ctx.request.body.createdAt;
    //文章id
    let article_id = null;

    try {
      let isExist = await mdModel.findOne({fileName: file.name});
      
      if (!isExist) { //不存在该文章的情况下 保存文件名及路径到数据库中
        
        const md = {
          fileName: file.name,
          saveAt: articles_path + file.name,
          createdAt,
        }
        let result = await mdModel.create(md);
        
        article_id = result._id; //将存入的文章的id返回给前端
      }else { //文章已存在的情况下，返回错误
        
        ctx.body = {
          status: 0,
          message: '文章已存在'
        }

        fs.unlink(file.path, function (err) {
          if (err) throw err;
        })

        return;
      }


      //移动文件到articles
      fs.rename(file.path, articles_path + file.name, function (err) {
      if (err) throw err;
      })

      ctx.body = {
        status: 1,
        article_id
      }

    } catch (error) {
      ctx.body = {
        status: -1,
        message: error
      }
    }

  }// end receiveFile

  async receiveMdInfo(ctx) {
    let MdInfo = ctx.request.body;
    let _id = MdInfo.article_id;
    let category = MdInfo.category.name;
    let tag = MdInfo.tags;
    
    try {
      //使用$addToSet操作符和$each修饰符添加多个元素到tags数组字段
      let result = await mdModel.findByIdAndUpdate({_id}, {
        category,
        '$addToSet': {tags: { $each: tag}}
      })
      


      ctx.body = {
        status: 1,
          message: 'success'
      }
      
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: -1,
        message: '发生未知错误1'
      }
    }
    

  }// end receiveMdInfo

  async getArticleList(ctx){
    //返回md对象给前端
    let mdList = await mdModel.find({});
    
    ctx.body = mdList;

  }

  //更新md文件
  async updateMdFile(ctx) {
    //1. 获取前端传回的文章ip和文件，
    //2. 若数据库中存在文章，则替换文件

    let id = ctx.request.body.id;
    let file = ctx.request.files.mdFile;

    try {
      let result = await mdModel.findById({_id: id});
      if (!result) {
        ctx.body = {
          status: 0,
          message: '该文章不存在'
        }
        return;
      }

      //如果存在该文章
      //1. 先将缓存文件移动到articles文件夹中
      //2. 更新数据库中的文件名和存储路径
      //3. 判断文件名与原来的是否相同，如果不相同则删除原来的文件，相同则无需做任何处理

      //移动文件到articles
      fs.rename(file.path, articles_path + file.name, function (err) {
        if (err) throw err;
      })

      let update = await mdModel.findByIdAndUpdate({_id: id}, {
        fileName: file.name,
        saveAt: articles_path + file.name
      })

      if (result.fileName != file.name) {
        fs.unlink(result.saveAt, function (err) {
          if (err) throw err;
        })
      }

      ctx.body = {
        status: 1,
        message: 'success'
      }

    } catch (error) {

      console.log(error);
      ctx.body = {
        status: -1,
        message: 'unknown error'
      }
    }



    ctx.body = {
      status: 1,
      message: 'success'
    }
    
  }// end updateMdFile

  async removeMdFile(ctx) {
    let _id = ctx.params.id;
    //1. 查询数据库中是否存在该文件
    //2. 删除数据库中的数据
    //3. 删除article文件夹中的文件

    try {
      const md = await mdModel.findByIdAndRemove(_id);
      if (md) {
        await fs.unlink(md.saveAt, function (err) {
          if (err) throw err
        })

        ctx.body = {
          status: 1,
          message: '删除成功'
        }
      }else{
        ctx.body = {
          status: 0,
          message:'删除失败，未找到该文件'
        }
      }

      
    } catch (error) {
      console.log(error);
      
      ctx.body = {
        status: 0,
        message:'发生未知错误'
      }
    }
  }
}

export default new Admin();