var Product     = require('../models/product');
var User        = require('../models/user');
var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost/shoppingApp');

//populate some new products.
var products = [
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/92/79/92793aba86092b2ff450a47a50a985c9e488db29.jpg],origin[dam],category[ladies_maternity_bottoms],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'MAMA Denim Bib Overalls',
        description : 'Bib overalls in washed stretch denim with distressed details and adjustable suspenders. Bib pocket, side and back pockets, buttons at sides, and tapered legs.',
        price       : 69.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/87/ec/87ec6ca9ec5ca3a2042dabe1f0bfe73e1f6c51a0.jpg],origin[dam],category[],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'V-neck Cotton Sweater',
        description : 'Fine-knit sweater in cotton with a V-neck, long sleeves, and ribbing at neckline, cuffs, and hem.',
        price       : 14.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/2e/9e/2e9ecfe6c88bfd83e3c2dd85cae981d3a068b075.jpg],origin[dam],category[men_trousers_trousers_skinny_all],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'Twill trousers Skinny fit',
        description : '5-pocket trousers in washed, slightly stretchy twill with a regular waist, zip fly and skinny legs. Skinny fit.',
        price       : 29.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/ac/27/ac27d3ae1fa155d3ad1e7aa61a3cdd8dcf7d534d.jpg],origin[dam],category[ladies_jacketscoats_biker],type[LOOKBOOK],hmver[1]&call=url[file:/product/zoom]&zoom=zoom',
        title       : 'Faux Suede Biker Jacket',
        description : 'Biker jacket in faux suede. Notched lapels with decorative snap fasteners, diagonal zip at front, and side pockets with zip. Long sleeves with zip at cuffs. Attached, adjustable belt at hem with a metal fastener. Lined.',
        price       : 79.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/5f/c8/5fc872bf27dc3c1e0376073c8a4bd07744f99dfc.jpg],origin[dam],category[],type[DESCRIPTIVESTILLLIFE],res[m],hmver[1]&call=url[file:/product/main]',
        title       : 'Crêped Dress',
        description : 'Knee-length dress in crêped woven fabric with a gathered, elasticized neckline. Opening at back of neck with button. 3/4-length sleeves with elasticized cuffs, seam at waist, and A-line skirt. Unlined.',
        price       : 39.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/8c/9c/8c9cb769771abe15e0861c8bd204ed515de392b3.jpg],origin[dam],category[ladies_maternity_tops],type[LOOKBOOK],res[m],hmver[1]&call=url[file:/product/main]',
        title       : 'MAMA 2-pack nursing tops',
        description : 'Soft nursing tops in organic cotton jersey with narrow, adjustable shoulder straps. Soft integral top with functional fasteners for easier nursing access, and an elasticated hem.',
        price       : 29.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/c5/b1/c5b1942bd766d3e787ea09e6bd6e373dde54f2fb.jpg],origin[dam],category[ladies_skirts_shortskirts],type[LOOKBOOK],res[m],hmver[1]&call=url[file:/product/main]',
        title       : 'Faux Suede Skirt',
        description : 'Knee-length skirt in faux suede. Removable belt with snap fasteners. Unlined.',
        price       : 59.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/74/af/74af3b28b8694f53766a4f67e28fafc15ff1adac.jpg],origin[dam],category[ladies_skirts_shortskirts],type[LOOKBOOK],hmver[1]&call=url[file:/product/main]',
        title       : 'Denim Skirt',
        description : 'Short, 5-pocket skirt in stretch denim. High waist and zip fly with button.',
        price       : 29.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/e4/42/e4425b8b75b617d7227fd4d97e025a9746d0b695.jpg],origin[dam],category[ladies_tops_longsleeve],type[LOOKBOOK],res[m],hmver[1]&call=url[file:/product/main]',
        title       : 'Short Jersey Top ',
        description : 'Short fitted top in jersey with long sleeves and a visible seam at front. Slightly shorter front section with a knot detail at hem.',
        price       : 14.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/2d/7c/2d7c8cf0e26be7a8e73671b074d7cb69dcbaf979.jpg],origin[dam],category[ladies_cardigansjumpers_cardigans],type[LOOKBOOK],hmver[1]&call=url[file:/product/main]',
        title       : 'Knit Cardigan ',
        description : 'Cardigan in a soft knit with dropped shoulders, long sleeves, and front pockets. No buttons.',
        price       : 29.99
    }),
    new Product({
        imagePath   : 'http://lp2.hm.com/hmgoepprod?set=source[/17/6d/176d673ed46da2aef8aab8230aa9970d75e17818.jpg],origin[dam],category[ladies_sport_bottoms],type[LOOKBOOK],res[m],hmver[1]&call=url[file:/product/main]',
        title       : 'Sports Tights ',
        description : 'Sports tights in fast-drying functional fabric with ventilating mesh sections. Wide waistband with concealed key pocket. Polyester content is partly recycled.',
        price       : 34.99
    })
];

//use function remove to make sure our databases doesn't have any duplicated values
Product.remove({},function(err){
  if(err){
    console.log("REMOVE Product databases failed")
  }
  else{
    //add product to our databases.
    for (var i = 0; i < products.length; i++){
        products[i].save(function(err, result) {
            if (i === products.length - 1){
                exit();
            }
        });}
    }
});

//create some new users
var newUsers = [new User({
    username    : 'admin@admin.com',
    password    : 'admin',
    fullname    : 'Cuneyt Celebican',
    admin       : true
  }),
  new User({
      username    : 'ypham@cmail.carleton.ca',
      password    : 'ypham',
      fullname    : 'Y Vuong Quoc Pham',
      admin       : false
    }),
    new User({
        username    : 'a',
        password    : 'a',
        fullname    : 'testing user',
        admin       : true
      })
];
//use function remove() to make sure we dont have duplicated accounts in our databases
User.remove({},function(err){
  if(err){
    console.log("REMOVE User accounts failed")
  }
  else{
    //after removing we store our accounts to databases.
    for (var i = 0; i < newUsers.length; i++){
      User.createUser(newUsers[i], function(err, user){
          if(err) throw err;
          console.log(user);
      });
      }
    }
});
//exit
function exit() {
    mongoose.disconnect();
}
