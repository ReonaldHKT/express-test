console.log('Javascript!!');

let marineUI = {}
{
  let proto = Object.create(HTMLElement.prototype);
  proto.status = function(setting){
    setting.unclickable == true ? this.setAttribute('unclickable', '') : this.removeAttribute('unclickable');
    setting.disable == true ? this.setAttribute('disable', '') : this.removeAttribute('disable');
  }
  proto.createdCallback = function(){
    let template = document.querySelector('template.m-button');
    let shadow = this.createShadowRoot();
    let clone = document.importNode(template.content, true);
    shadow.appendChild(clone);
  }
  marineUI.button = document.registerElement('m-button', {
    prototype: proto
  });
}



let fetchWrapper = function(urlString, options) {

  return fetch(urlString, options)
  .catch(err => {
    // corsエラー、networkエラー等、そもそもサーバへ本リクエストする以前のエラー
      console.log("CLIENT-ERR :", err)
    throw new Error("アクセスできません、時間を置いてお試しください")
  })
  .then(response => {
    // レスポンスのヘッダを処理したい場合はここで
    for (const pair of response.headers.entries()) {
      // console.log(" RES-HEADER: ", pair[0]+ ': '+ pair[1])
    }
    // 返り値はpromiseになってるので展開する
    const responseBodyPromise = response.text()
    return responseBodyPromise.then(body => ({ body: body, responseOk: response.ok }))
  })
  .then(({ body, responseOk }) => {
    // ここで正常なリクエスト完了だと判定
    if (responseOk) {
      return body
    }
    // サーバとのやりとりが出来ている40x系、50x系はここ
    console.log("SERVER-ERR :", body)
    throw new Error(body || "リクエストに失敗しました")
  })
}

const getHash = (raw, stretch) => {
  if(typeof stretch != "number") stretch = 10;
  return fetchWrapper('/api/hash/get/', {
    method: 'POST',
    body: JSON.stringify({
      text: raw,
      stretch: stretch
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => {
    const resObj = JSON.parse(res);
    if(resObj.successful){
      return resObj.hash;
    }else{
      throw new Error(resObj.text);
    }
  }).catch(err => {
    console.log(err);
  });
}

const verifyHash = (text, hash) => {
  return fetchWrapper('/api/hash/verify/', {
    method: 'POST',
    body: JSON.stringify({
      text: text,
      hash: hash
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(res => {
    const resObj = JSON.parse(res);
    if(resObj.successful){
      return resObj.matched;
    }else{
      throw new Error(resObj.text);
    }
  }).catch(err => {
    console.log(err);
  });
}
