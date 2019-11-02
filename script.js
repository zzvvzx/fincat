let product;
let product_name = [];
let product_cat = [];
let product_catUnique = {};
let search = [];

const input = document.getElementById('input');
const list1 = document.getElementById('list-category');
const listProduct = document.getElementById('list-product');


/* set up XMLHttpRequest */
let url = "db.xlsx";
let xhr = new XMLHttpRequest();
xhr.open("GET", url, true);
xhr.responseType = "arraybuffer";
xhr.onload = function(e) {
  let arraybuffer = xhr.response;
  let data = new Uint8Array(arraybuffer);
  let arr  = new Array();
  for (let i = 0; i !== data.length; ++i) 
    arr[i] = String.fromCharCode(data[i]);
  let bstr = arr.join("");
  let workbook = XLSX.read(bstr, { type: "binary" });
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  product = XLSX.utils.sheet_to_json(worksheet, { raw: true });
 
  for(let i=0; i<product.length; i++){
    let v = Object.values(product[i]);
    product_name.push(v[4].toLowerCase());
    product_cat.push(v[5].toLowerCase());
    product_catUnique[v[5].toLowerCase()] = 0;
  }
  product_catUnique = Object.keys(product_catUnique).sort();
  genIndex();
}
xhr.send();


function genIndex(){
  let html = '';
  for(let i=0; i<product_catUnique.length; i++){
    let c = product_catUnique[i];
    html += '<li data-cat="' + c + '">' + c + '</li>';
  }
  list1.innerHTML += html;
}


/* search */
function ser(str){
  
  search    = [];
  let str_empty = 'No data.';
  let str_start = 'Ketik nama barang atau pilih kategori  . .';
  let html  = '';
  let db    = str ? str : input.value;
  let t;
  
  // by input
  if(!str){
    t = input.value;
    for(let i=0; i<product_name.length; i++){
      if(~product_name[i].indexOf(t))
        search.push(Object.values(product[i]));
    }
  }
  // by cat
  else if(str){
    t = str;
    for(let i=0; i<product_cat.length; i++){
      if(product_cat[i] === t)
        search.push(Object.values(product[i]));
    }
  }
  
  if(t.length < 2){
    listProduct.innerHTML = str_start;
    return;
  }
  
  // gen list
  for(let i=0; i<search.length; i++){
    let q = search[i][0].substr(0,3);
    
    html += '<li class="item">' + 
      '<span class="item-harga">' + parseInt(search[i][2]).toLocaleString('id') + '</span>' + 
      '<span class="item-qty">'  + q + '</span>' +
      '<span class="item-nama">'  + search[i][4] + '</span>' +
    '</li>';
  }
  listProduct.innerHTML = html ? html : empty;
}


/* kbd */
document.addEventListener('keyup', function(e){
  if(e.key === 'Escape'){
    input.value = '';
    input.focus();
  }
  ser();
});

/* click */
document.addEventListener('click', function(e){
  if(e.target.parentNode.id === 'list-category'){
    if(e.target.dataset.cat)
      ser(e.target.dataset.cat);
  }
    
});

input.focus();
ser();