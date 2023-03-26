import axios from './axios'

// post请求
export const post = (url, data) => {
  data = data || {};
  Object.defineProperty(data, 'button', {enumerable: false})
  Object.defineProperty(data, 'createTime', {enumerable: false})

  return axios({
    url: url,
    method: 'post',
    data
  });
}

// post请求
export const getUrl = (url) => {
  return axios({
    url: url,
    method: 'get'
  });
}

// 登录
export const login = data => {
  return post('/login', data);
}

// 登出
export const logout = () => {
  return post('/logout');
}

// 验证码
export const captcha = () => {
  return axios({
    url: '/captcha',
    method: 'post',
    responseType: 'arraybuffer'
  })
}

// 文件上传
export const upload = (data) => {
  let param = new FormData();
  for (const p in data) {
    param.append(p, data[p]);
  }

  return axios({
    url: '/affix/upload',
    method: 'post',
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  })
}

// 文件下载
export const download = (fileId) => {
  let data = {id: fileId};

  return axios({
    url: '/affix/download',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export const downloadLocal = (id) => {
  return download(id).then((res) => {
    let fileName = res.headers['content-disposition'].split('=')[1];
    fileName = fileName.replace(/"/g, '');
    let blob = new Blob([res.data], {type: 'application/octet-stream'})
    let downloadElement = document.createElement('a');
    let href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = decodeURI(fileName); // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

// 流程公文下载
export const downloadFlowDoc = (affixId) => {
  return axios({
    url: '/affix/wps/downloadProtect/' + affixId,
    method: 'get',
    responseType: 'arraybuffer'
  })
}

// 流程公文PDF下载
export const downloadFlow = (affixId) => {
  return axios({
    url: '/affix/wps/download?affixId=' + affixId,
    method: 'get',
    responseType: 'arraybuffer'
  }).then(res => {
    let fileName = res.headers['content-disposition'].split('=')[1];
    fileName = fileName.replace(/"/g, '');
    let blob = new Blob([res.data], {type: 'application/octet-stream'})
    let downloadElement = document.createElement('a');
    let href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = decodeURI(fileName); // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

export const downloadAffix = (affixId) => {
  let data = {};
  return axios({
    url: '/affix/downloadAffix/' + affixId,
    method: 'post',
    responseType: 'arraybuffer',
    data
  }).then(res => {
    let fileName = res.headers['content-disposition'].split('=')[1];
    fileName = fileName.replace(/"/g, '');
    let blob = new Blob([res.data], {type: 'application/octet-stream'})
    let downloadElement = document.createElement('a');
    let href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = decodeURI(fileName); // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
}

// 文件下载
export const downloadAll = (affixId) => {
  let data = {affixId: affixId};

  return axios({
    url: '/affix/downloadAll',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

//批量下载公文里面的附件
export const downloadAllDocument = (affixId,name) => {
  let data = {affixId: affixId, trueName: name};

  return axios({
    url: '/affix/downloadAllDocument',
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// work文件下载
export const downloadWord = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

// 查询文件
export const queryFile = (id) => {
  return post('/affix/queryItems', {id: id});
}

// 查询附件
export const queryAffix = (affixId) => {
  return post('/affix/queryItems', {affixId: affixId});
}

// 删除附件
export const deleteAffix = (fileId) => {
  return post('/affix/deleteItem', {id: fileId});
}

// 文件上传
export const uploadFile = (url, data) => {
  let param = new FormData();
  for (const p in data) {
    param.append(p, data[p]);
  }

  return axios({
    url: url,
    method: 'post',
    headers: {'Content-Type':'multipart/form-data'},
    data: param
  })
}

// 文件下载
export const downloadFile = (url, data) => {
  return axios({
    url: url,
    method: 'post',
    responseType: 'arraybuffer',
    data
  })
}

export const saveFile = (res) => {
  let fileName = res.headers['content-disposition'].split('=')[1];
  fileName = fileName.replace(/"/g, '');
  let blob = new Blob([res.data], {type: 'application/octet-stream'});
  if('msSaveOrOpenBlob' in navigator) {//兼容ie
    blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});
    window.navigator.msSaveOrOpenBlob(blob, fileName);
  } else {
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob); // 创建下载的链接
    downloadElement.href = href;
    downloadElement.download = decodeURI(fileName); // 下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); // 点击下载
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  }
}

export default {
  post,
  login,
  logout,
  captcha,
  upload,
  download,
  downloadAll,
  downloadAllDocument,
  queryFile,
  queryAffix,
  deleteAffix,
  uploadFile,
  downloadFile,
  downloadLocal,
  saveFile,
  downloadWord,
  downloadFlowDoc,
  downloadFlow,
  downloadAffix
}
