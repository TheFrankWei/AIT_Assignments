require('./db.js');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ImagePost = mongoose.model('ImagePost');
const Image = mongoose.model('Image');
const app = express();

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/image-posts/:slug', function(req, res){
  const slug = req.params.slug;
  const img = new Image({
    url: req.body.url,
    caption: req.body.caption
  });
  img.save((err, image) => {
    ImagePost.findOne({slug: slug}, function(err, imageposts) {
    imageposts.images.push(image);
    imageposts.save(()=>{
      res.redirect('/image-posts/' + slug);
    });
    });
  });
});

app.post('/image-posts/:slug/delete', function(req, res){
  const slug = req.params.slug;
  ImagePost.findOne({slug: slug}, function(err, imageposts) {
  const deleteid = req.body.delete;
    console.log(deleteid);
    if (Array.isArray(deleteid)){
      // console.log('this is an array');
      // console.log(imageposts.images.length);
      for(let i = 0; i < imageposts.images.length; i++){
        // console.log('we in the first array');
        for(let j = 0; j < imageposts.images.length; j++){
        if(imageposts.images[j].id === deleteid[i]){
          console.log(imageposts.images[j]);
          imageposts.images.id(deleteid[i]).remove();
          console.log('image removed' + deleteid[i]);
          imageposts.images.splice(j, 1);
          imageposts.save(()=>{
            res.redirect('/image-posts/' + slug);
          });
          }
        }
      }
    } else {
      // console.log('this is not an array');
       imageposts.images.id(deleteid).remove();
       imageposts.save(()=>{
         res.redirect('/image-posts/' + slug);
       });
    }
    });
});



app.get('/image-posts/', function(req, res) {
  ImagePost.find(function(err,imageposts){
      res.render('image-posts.hbs', {posts:imageposts});
  });
});

app.post('/image-posts/', function(req, res){
  const imagePost = new ImagePost({
    title: req.body.title,
    images: []
  });

  for(let i=1; i<=3; i++){
    const imageUrl = req.body['url'+i];
    const imageCaption = req.body['caption'+i];
    // console.log(imageUrl + '============' + i);

    if(imageUrl){
      const img = new Image({
        caption: imageCaption,
        url: imageUrl
      });
      img.save();
      imagePost.images.push(img);
      // console.log('image added');
    }
  }
  if(imagePost.images.length !== 0){
  imagePost.save(()=>{
    res.redirect('/image-posts/');
  });
}
});

app.get('/image-posts/:slug', function(req, res) {
  const slug = req.params.slug;
  console.log(slug);
  ImagePost.findOne({slug: slug }, function(err, imageposts) {
    res.render('slugs.hbs', {posts:imageposts});
  });
});



app.listen(3000);
console.log('Started server on port 3000');
