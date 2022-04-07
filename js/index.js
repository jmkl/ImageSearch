
const { Pexels, GOOGLE, PEXEL, DUCKGO } = require("./js/Pexel.js");
const pexels = new Pexels();

const { TextureLab } = require("./js/Texturelab.js");
const { entrypoints } = require("uxp");
const{ImageUtils} = require("./js/imgUtils.js");
const imageutils = new ImageUtils();
const texturelab = new TextureLab();
const api_keys = [
  "9c9a444cb96fd007ec65aed7f70907a51dc851b982c93e4ac4265be126fcc781",
  "3fe06f0c47450e58f99d30762191f26e395bc13c97195b19618bae6722ec7c30",
  "fb8f086435ccacf58fe75f5dee0747082d45782885ddb31337ccd15ea644a77d",
  "e6e1d232e182b6d101472bfd35f51f3e1b569b222fa24c07a5650968c9cf633d",
  "3af23198af77473a346839d9f564c51b90e18b02988c090620b098a86a7d939f"]



const searchImages = $("#panelcontainer");
const searchEngine = document.getElementById("searchEngine");
const serpAPI = document.getElementById("serpAPI");
const serpAPIoptions = document.getElementById("serpAPIoptions");
function loading(isRun) {
  $(".panelloading").css("display", isRun ? "block" : "none");
  $(".panelcontent").css("display", isRun ? "none" : "block");
}
searchEngine.selectedIndex = 0;
api_keys.forEach((item, index) => {
  var option = document.createElement("sp-menu-item");
  option.value = item;
  option.innerHTML = ("key " + (index + 1));
  serpAPIoptions.appendChild(option);
})
serpAPI.selectedIndex = 0;
checkCount();
async function checkCount() {
  const url = `https://serpapi.com/account?api_key=${api_keys[serpAPI.selectedIndex]}`;
  await fetch(url).then(res => res.json()).then((data) => {
    $("#btnAPI").text(data.plan_searches_left);
  }).catch((error) => { console.log(error) });

}
serpAPI.addEventListener("change", (e) => {
  checkCount();
});

$("#btnAPI").click(async (e) => {
  checkCount();
})

function createImage(photo, engine) {
  let thumb;
  let ori;
  switch (engine) {

    case GOOGLE:
      thumb = photo.thumbnail;
      ori = photo.original;
      break;
    case PEXEL:
      thumb = photo.src.tiny;
      ori = photo.src.original;
      break;
    case DUCKGO:
      thumb = photo.thumbnail;
      ori = photo.image;
      break;
    default: break;
  }

  const element = `
  <div class="search-img-container">
    <img src="${thumb}" class="search-img" value="${ori}">
  </div>
  `;
  return element;
}
function getImages() {
  loading(true);
  let engine = (searchEngine.options[searchEngine.selectedIndex].innerHTML).toLowerCase();


  searchImages.empty();
  const txt = document.getElementById("txtKeyword");
  pexels.getImages(txt.value, engine, true).then(function (result) {
    const response = JSON.parse(result);
    let photos;
    switch (engine) {
      case GOOGLE: photos = response.images_results; break;
      case PEXEL: photos = response.photos; break;
      case DUCKGO: photos = response.message; break;
      default: break;
    }

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const img = createImage(photo, engine);
      searchImages.append(img);

      //observer.observe();



    }
    loading(false);
    $(".search-img").click(function (e) {
      const url = ($(this).attr("value"));
      imageutils.ImageDownloader(url).then(()=>{}).catch((error)=>{
        console.error(error);
      });
      //downloadImage(url);
    });
  });


}

$('#txtKeyword').keydown(function (event) {
  var keyCode = (event.keyCode ? event.keyCode : event.which);
  console.log(keyCode);
  if (keyCode == 13) {
    getImages();
  }
});
$("#btnSearch").on("click", () => { getImages() });



function toggleClass(theshit) {
  $(".tab-content").each((i, v) => {
    const active = "tab-content-active";
    if ($(v).hasClass(active)) { $(v).removeClass(active); }
    else { $(v).addClass(active); }




  })

}
let texturelab_data = null;
$(document).ready(async () => {

  texturelab_data = await texturelab.getTextureLabLists();

  if (texturelab_data != null) {
    (texturelab_data.message).forEach((v) => {
      $(".tl-menu-panel").append(`<sp-action-button class="tl-btn">${v.title}</sp-action-button>`)
    });

  }
  $(".tl-btn").on("click", function () {
    (texturelab_data.message).forEach((td) => {
      if (td.title == $(this).text()) {
        imageutils.PushList(td.data,$(".tl-content-panel"),"tl-image");

      }
    })

  })



 
  

  $(".texturelab").scroll(() => {

    const tl = document.querySelector(".texturelab");
   
    if (imageutils.getData().length>0 & (tl.scrollTop + tl.clientHeight) == tl.scrollHeight) {  
   
      imageutils.append10Data("tl-image");
     
    }
  })

  



})





$(".tab-button").each((index, value) => {
  $(value).click(function (ev) {
    var $this = $(this);
    var content = $this.siblings(".tab-content");
    toggleClass(content);
  })
})


$(".tl-content-panel").on("click",".tl-image", function() {

  imageutils.ImageDownloader($(this).attr("data-image")).then(()=>{}).catch((error)=>{
    console.error(error);
  });
})







const reloadPlugin = () => {
  window.location.reload();
}




entrypoints.setup({
  commands: {
    reloadPlugin: () => reloadPlugin()
  },
  panels: {
    iSearchPanel: {
      show({ xxx } = {}) {

      },
      menuItems: [
        { id: "reloadPanelFlyout", label: "Reload Panel", checked: false, enabled: true },

      ],
      invokeMenu(id) {
        switch (id) {
          case "reloadPanelFlyout":
            reloadPlugin();
            break;
          default:

            break;
        }
      }
    }
  }
});