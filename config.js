import fs from 'fs';

let articles_path = './articles';
let uploads_path = './uploads';

//创建需要的文件夹

try {
  if(!fs.existsSync(articles_path)){
    fs.mkdir(articles_path, function (err) {
      if (err) throw err
    });
  }

  if (!fs.existsSync(uploads_path)) {
    fs.mkdir(uploads_path, function (err) {
      if (err) throw err
    })
  }
  
} catch (error) {
  console.log(error);
  
}
