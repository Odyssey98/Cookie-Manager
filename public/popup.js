// 延迟加载主应用
window.addEventListener('DOMContentLoaded', () => {
  // 创建 iframe 加载主应用
  const iframe = document.createElement('iframe');
  iframe.src = 'index.html';
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  
  // 当 iframe 加载完成后隐藏加载提示
  iframe.onload = () => {
    document.getElementById('loading').style.display = 'none';
  };
  
  document.body.appendChild(iframe);
}); 